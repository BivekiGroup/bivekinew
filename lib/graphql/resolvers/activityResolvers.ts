import { GraphQLContext } from '../context';
import { AuthenticationError } from '@apollo/server/errors';

export const activityResolvers = {
  Query: {
    // Получить активности (с фильтрацией по проекту)
    activities: async (
      _: any,
      {
        projectId,
        limit = 50,
        offset = 0,
      }: { projectId?: string; limit?: number; offset?: number },
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      const where: any = {};

      // Если указан проект, фильтруем по нему
      if (projectId) {
        where.projectId = projectId;
      }

      // Для клиентов показываем только активность их проектов
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

      return await prisma.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: true,
          project: true,
          task: true,
        },
      });
    },

    // Получить личные активности пользователя
    myActivities: async (
      _: any,
      { limit = 50, offset = 0 }: { limit?: number; offset?: number },
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new AuthenticationError('Необходима авторизация');
      }

      return await prisma.activity.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: true,
          project: true,
          task: true,
        },
      });
    },
  },

  Activity: {
    // Резолвер для поля metadata (преобразование JSON в строку)
    metadata: (parent: any) => {
      return parent.metadata ? JSON.stringify(parent.metadata) : null;
    },
  },
};
