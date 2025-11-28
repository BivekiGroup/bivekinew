import { GraphQLContext } from '../context';
import { AuthenticationError, ForbiddenError } from '@apollo/server/errors';

export const notificationResolvers = {
  Query: {
    // Получить уведомления пользователя
    notifications: async (
      _: any,
      { limit = 20, offset = 0 }: { limit?: number; offset?: number },
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      return await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: true,
        },
      });
    },

    // Получить статистику уведомлений
    notificationStats: async (_: any, __: any, { prisma, user }: GraphQLContext) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      const total = await prisma.notification.count({
        where: { userId: user.id },
      });

      const unread = await prisma.notification.count({
        where: {
          userId: user.id,
          read: false,
        },
      });

      return { total, unread };
    },

    // Получить непрочитанные уведомления
    unreadNotifications: async (_: any, __: any, { prisma, user }: GraphQLContext) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      return await prisma.notification.findMany({
        where: {
          userId: user.id,
          read: false,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
        },
      });
    },
  },

  Mutation: {
    // Отметить уведомление как прочитанное
    markNotificationAsRead: async (
      _: any,
      { id }: { id: string },
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new Error('Уведомление не найдено');
      }

      if (notification.userId !== user.id) {
        throw new ForbiddenError('Нет доступа к этому уведомлению');
      }

      return await prisma.notification.update({
        where: { id },
        data: { read: true },
        include: { user: true },
      });
    },

    // Отметить все уведомления как прочитанные
    markAllNotificationsAsRead: async (_: any, __: any, { prisma, user }: GraphQLContext) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false,
        },
        data: { read: true },
      });

      return true;
    },

    // Удалить уведомление
    deleteNotification: async (
      _: any,
      { id }: { id: string },
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new Error('Уведомление не найдено');
      }

      if (notification.userId !== user.id) {
        throw new ForbiddenError('Нет доступа к этому уведомлению');
      }

      await prisma.notification.delete({
        where: { id },
      });

      return true;
    },
  },
};
