import { prisma } from '../prisma/client';
import { verifyToken, JWTPayload } from '../auth/jwt';
import { User, UserRole } from '@prisma/client';

export interface GraphQLContext {
  prisma: typeof prisma;
  user: User | null;
  token: string | null;
  ip: string | null;
  userAgent: string | null;
}

export async function createContext(req: Request): Promise<GraphQLContext> {
  const token = getTokenFromRequest(req);
  let user: User | null = null;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      // Проверяем существование сессии
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (session && session.expiresAt > new Date()) {
        user = session.user;
      }
    }
  }

  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent');

  return {
    prisma,
    user,
    token,
    ip,
    userAgent,
  };
}

function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

function getClientIp(req: Request): string | null {
  // Попытка получить IP из различных заголовков
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return null;
}

// Middleware для проверки авторизации
export function requireAuth(context: GraphQLContext): void {
  if (!context.user) {
    throw new Error('Не авторизован');
  }
}

// Middleware для проверки роли
export function requireRole(context: GraphQLContext, role: UserRole): void {
  requireAuth(context);
  if (context.user!.role !== role) {
    throw new Error('Недостаточно прав');
  }
}

// Middleware для проверки админа
export function requireAdmin(context: GraphQLContext): void {
  requireRole(context, UserRole.ADMIN);
}
