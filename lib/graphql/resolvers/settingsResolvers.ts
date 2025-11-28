import { GraphQLContext } from '../context';
import { AuthenticationError } from '@apollo/server/errors';

interface UpdateUserSettingsInput {
  emailNotifications?: boolean;
  taskNotifications?: boolean;
  projectNotifications?: boolean;
  deadlineNotifications?: boolean;
  theme?: string;
  language?: string;
}

export const settingsResolvers = {
  Query: {
    // Получить настройки текущего пользователя
    mySettings: async (_: any, __: any, { prisma, user }: GraphQLContext) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      let settings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
      });

      // Если настроек еще нет, создаем с дефолтными значениями
      if (!settings) {
        settings = await prisma.userSettings.create({
          data: {
            userId: user.id,
            emailNotifications: true,
            taskNotifications: true,
            projectNotifications: true,
            deadlineNotifications: true,
            theme: 'dark',
            language: 'ru',
          },
        });
      }

      return settings;
    },
  },

  Mutation: {
    // Обновить настройки пользователя
    updateMySettings: async (
      _: any,
      { input }: { input: UpdateUserSettingsInput },
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      // Проверяем, существуют ли настройки
      let settings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
      });

      if (settings) {
        // Обновляем существующие настройки
        return await prisma.userSettings.update({
          where: { userId: user.id },
          data: {
            ...input,
          },
        });
      } else {
        // Создаем новые настройки
        return await prisma.userSettings.create({
          data: {
            userId: user.id,
            emailNotifications: input.emailNotifications ?? true,
            taskNotifications: input.taskNotifications ?? true,
            projectNotifications: input.projectNotifications ?? true,
            deadlineNotifications: input.deadlineNotifications ?? true,
            theme: input.theme ?? 'dark',
            language: input.language ?? 'ru',
          },
        });
      }
    },
  },
};
