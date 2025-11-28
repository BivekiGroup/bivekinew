import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3, getFileExtensionFromMime } from '@/lib/s3';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Определить тип файла по MIME
function getFileType(mimeType: string): 'AVATAR' | 'DOCUMENT' | 'IMAGE' | 'ARCHIVE' | 'OTHER' {
  if (mimeType.startsWith('image/')) {
    return 'IMAGE';
  } else if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('spreadsheetml')
  ) {
    return 'DOCUMENT';
  } else if (
    mimeType === 'application/zip' ||
    mimeType === 'application/x-rar-compressed' ||
    mimeType === 'application/x-7z-compressed'
  ) {
    return 'ARCHIVE';
  }
  return 'OTHER';
}

// Определить папку в S3 по типу файла
function getS3Folder(
  fileType: 'AVATAR' | 'DOCUMENT' | 'IMAGE' | 'ARCHIVE' | 'OTHER'
): 'avatars' | 'documents' | 'images' | 'other' {
  switch (fileType) {
    case 'AVATAR':
      return 'avatars';
    case 'IMAGE':
      return 'images';
    case 'DOCUMENT':
    case 'ARCHIVE':
      return 'documents';
    default:
      return 'other';
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
    }

    // Получаем FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileTypeParam = formData.get('type') as string | null; // 'avatar', 'document', etc.
    const projectId = formData.get('projectId') as string | null;
    const taskId = formData.get('taskId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Файл не предоставлен' }, { status: 400 });
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Файл слишком большой (максимум 10MB)' }, { status: 400 });
    }

    // Конвертируем файл в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Определяем тип файла
    let fileType: 'AVATAR' | 'DOCUMENT' | 'IMAGE' | 'ARCHIVE' | 'OTHER';
    if (fileTypeParam === 'avatar') {
      fileType = 'AVATAR';
    } else {
      fileType = getFileType(file.type);
    }

    const s3Folder = getS3Folder(fileType);

    // Загружаем в S3
    const { url, key } = await uploadFileToS3(buffer, file.name, file.type, s3Folder);

    // Сохраняем информацию о файле в базу данных
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        type: fileType,
        mimeType: file.type,
        size: file.size,
        url,
        key,
        userId,
        projectId: projectId || undefined,
        taskId: taskId || undefined,
      },
      include: {
        user: true,
        project: true,
        task: true,
      },
    });

    // Если это аватар, обновляем профиль пользователя
    if (fileType === 'AVATAR') {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: url },
      });
    }

    // Создаем активность
    await prisma.activity.create({
      data: {
        type: 'FILE_UPLOADED',
        description: `Загружен файл: ${file.name}`,
        userId,
        projectId: projectId || undefined,
        taskId: taskId || undefined,
        metadata: {
          fileName: file.name,
          fileType,
          fileSize: file.size,
        },
      },
    });

    return NextResponse.json({
      success: true,
      file: fileRecord,
    });
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}
