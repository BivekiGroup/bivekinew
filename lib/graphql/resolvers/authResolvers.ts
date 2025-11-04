import { GraphQLContext } from '../context';
import { validateOrThrow, emailSchema, authCodeSchema } from '../../utils/validation';
import { generateAuthCode, isValidAuthCode } from '../../auth/codeGenerator';
import { generateToken } from '../../auth/jwt';
import { sendAuthCode } from '../../email/emailService';
import { addMinutes, addDays } from 'date-fns';

export const authResolvers = {
  Mutation: {
    /**
     * Запросить код авторизации
     */
    requestAuthCode: async (
      _: unknown,
      { email }: { email: string },
      context: GraphQLContext
    ) => {
      try {
        // Валидация email
        const validatedEmail = validateOrThrow(emailSchema, email);

        // Проверяем, существует ли пользователь с таким email
        const user = await context.prisma.user.findUnique({
          where: { email: validatedEmail },
        });

        if (!user) {
          return {
            success: false,
            message: 'Пользователь с таким email не найден. Обратитесь к администратору.',
          };
        }

        if (!user.isActive) {
          return {
            success: false,
            message: 'Ваш аккаунт деактивирован. Обратитесь к администратору.',
          };
        }

        // Генерируем код
        const code = generateAuthCode();
        const expiresAt = addMinutes(new Date(), 10); // Код действует 10 минут

        // Удаляем все предыдущие неиспользованные коды для этого пользователя
        await context.prisma.authCode.deleteMany({
          where: {
            userId: user.id,
            used: false,
          },
        });

        // Создаем новый код
        await context.prisma.authCode.create({
          data: {
            code,
            userId: user.id,
            expiresAt,
            ipAddress: context.ip,
            userAgent: context.userAgent,
          },
        });

        // Отправляем код на email
        await sendAuthCode(validatedEmail, code);

        return {
          success: true,
          message: 'Код отправлен на указанный email',
          expiresAt: expiresAt.toISOString(),
        };
      } catch (error) {
        console.error('Error in requestAuthCode:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Ошибка отправки кода',
        };
      }
    },

    /**
     * Войти с кодом
     */
    login: async (
      _: unknown,
      { email, code }: { email: string; code: string },
      context: GraphQLContext
    ) => {
      try {
        // Валидация
        const validatedEmail = validateOrThrow(emailSchema, email);
        const validatedCode = validateOrThrow(authCodeSchema, code);

        // Находим пользователя
        const user = await context.prisma.user.findUnique({
          where: { email: validatedEmail },
        });

        if (!user || !user.isActive) {
          return {
            success: false,
            message: 'Неверный email или код',
          };
        }

        // Находим код
        const authCode = await context.prisma.authCode.findFirst({
          where: {
            userId: user.id,
            code: validatedCode,
            used: false,
            expiresAt: {
              gt: new Date(),
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (!authCode) {
          return {
            success: false,
            message: 'Неверный или истекший код',
          };
        }

        // Помечаем код как использованный
        await context.prisma.authCode.update({
          where: { id: authCode.id },
          data: { used: true },
        });

        // Удаляем старые сессии пользователя (опционально, можно оставить)
        await context.prisma.session.deleteMany({
          where: {
            userId: user.id,
            expiresAt: {
              lt: new Date(),
            },
          },
        });

        // Создаем новую сессию
        const sessionExpiresAt = addDays(new Date(), 30);
        const token = generateToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          sessionId: '', // Обновим после создания
        });

        const session = await context.prisma.session.create({
          data: {
            userId: user.id,
            token,
            expiresAt: sessionExpiresAt,
            ipAddress: context.ip,
            userAgent: context.userAgent,
          },
        });

        // Генерируем финальный токен с sessionId
        const finalToken = generateToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          sessionId: session.id,
        });

        // Обновляем токен в сессии
        await context.prisma.session.update({
          where: { id: session.id },
          data: { token: finalToken },
        });

        return {
          success: true,
          message: 'Вход выполнен успешно',
          token: finalToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            isActive: user.isActive,
          },
        };
      } catch (error) {
        console.error('Error in login:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Ошибка авторизации',
        };
      }
    },

    /**
     * Выйти из системы
     */
    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      try {
        if (!context.token) {
          return {
            success: false,
            message: 'Не авторизован',
          };
        }

        // Удаляем сессию
        await context.prisma.session.deleteMany({
          where: { token: context.token },
        });

        return {
          success: true,
          message: 'Выход выполнен успешно',
        };
      } catch (error) {
        console.error('Error in logout:', error);
        return {
          success: false,
          message: 'Ошибка выхода из системы',
        };
      }
    },
  },
};
