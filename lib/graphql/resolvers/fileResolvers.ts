import { GraphQLContext } from '../context';
import { AuthenticationError, ForbiddenError } from '@apollo/server/errors';
import { deleteFileFromS3 } from '@/lib/s3';

export const fileResolvers = {
  Query: {
    // Получить файлы (с фильтрацией по проекту или задаче)
    files: async (
      _: any,
      { projectId, taskId }: { projectId?: string; taskId?: string },
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      const where: any = {};

      if (projectId) {
        where.projectId = projectId;
      }

      if (taskId) {
        where.taskId = taskId;
      }

      // Для клиентов показываем только файлы их проектов
      if (user.role === 'CUSTOMER') {
        const userProjects = await prisma.project.findMany({
          where: { customerId: user.id },
          select: { id: true },
        });

        const projectIds = userProjects.map((p) => p.id);
        where.OR = [
          { projectId: { in: projectIds } },
          { userId: user.id },
        ];
      }

      return await prisma.file.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          project: true,
          task: true,
        },
      });
    },

    // Получить файл по ID
    file: async (_: any, { id }: { id: string }, { prisma, user }: GraphQLContext) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      const file = await prisma.file.findUnique({
        where: { id },
        include: {
          user: true,
          project: true,
          task: true,
        },
      });

      if (!file) {
        throw new Error('Файл не найден');
      }

      // Проверка доступа для клиентов
      if (user.role === 'CUSTOMER') {
        if (file.userId !== user.id) {
          // Проверяем, есть ли доступ к проекту
          if (file.projectId) {
            const project = await prisma.project.findUnique({
              where: { id: file.projectId },
            });

            if (project?.customerId !== user.id) {
              throw new ForbiddenError('Нет доступа к этому файлу');
            }
          } else {
            throw new ForbiddenError('Нет доступа к этому файлу');
          }
        }
      }

      return file;
    },
  },

  Mutation: {
    // Удалить файл
    deleteFile: async (_: any, { id }: { id: string }, { prisma, user }: GraphQLContext) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      const file = await prisma.file.findUnique({
        where: { id },
      });

      if (!file) {
        throw new Error('Файл не найден');
      }

      // Только владелец файла или админ могут удалить файл
      if (file.userId !== user.id && user.role !== 'ADMIN') {
        throw new ForbiddenError('Нет доступа для удаления этого файла');
      }

      // Удалить файл из S3
      try {
        await deleteFileFromS3(file.key);
      } catch (error) {
        console.error('Ошибка удаления файла из S3:', error);
        // Продолжаем удаление записи из БД даже если S3 недоступен
      }

      await prisma.file.delete({
        where: { id },
      });

      return true;
    },
  },
};
