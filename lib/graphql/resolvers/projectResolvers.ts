import { GraphQLContext } from '../context';
import { ProjectStatus } from '@prisma/client';

export const projectResolvers = {
  Query: {
    // Получить все проекты (только для админа и разработчиков)
    projects: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'DEVELOPER') {
        throw new Error('Недостаточно прав');
      }

      const projects = await context.prisma.project.findMany({
        include: {
          customer: true,
          tasks: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return projects.map((project) => ({
        ...project,
        tasksCount: project.tasks.length,
        completedTasksCount: project.tasks.filter((task) => task.status === 'DONE').length,
        progress: project.tasks.length > 0
          ? Math.round((project.tasks.filter((task) => task.status === 'DONE').length / project.tasks.length) * 100)
          : 0,
      }));
    },

    // Получить один проект
    project: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      const project = await context.prisma.project.findUnique({
        where: { id },
        include: {
          customer: true,
          tasks: true,
        },
      });

      if (!project) {
        throw new Error('Проект не найден');
      }

      // Проверка прав доступа
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'DEVELOPER' &&
        project.customerId !== context.user.id
      ) {
        throw new Error('Недостаточно прав');
      }

      return {
        ...project,
        tasksCount: project.tasks.length,
        completedTasksCount: project.tasks.filter((task) => task.status === 'DONE').length,
        progress: project.tasks.length > 0
          ? Math.round((project.tasks.filter((task) => task.status === 'DONE').length / project.tasks.length) * 100)
          : 0,
      };
    },

    // Получить проекты текущего пользователя
    myProjects: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      const projects = await context.prisma.project.findMany({
        where: {
          customerId: context.user.id,
        },
        include: {
          customer: true,
          tasks: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return projects.map((project) => ({
        ...project,
        tasksCount: project.tasks.length,
        completedTasksCount: project.tasks.filter((task) => task.status === 'DONE').length,
        progress: project.tasks.length > 0
          ? Math.round((project.tasks.filter((task) => task.status === 'DONE').length / project.tasks.length) * 100)
          : 0,
      }));
    },
  },

  Mutation: {
    // Создать проект (только для админа)
    createProject: async (
      _: unknown,
      { input }: { input: { name: string; description?: string; customerId: string; startDate?: string; dueDate?: string } },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      if (context.user.role !== 'ADMIN') {
        throw new Error('Недостаточно прав');
      }

      // Проверяем существование заказчика
      const customer = await context.prisma.user.findUnique({
        where: { id: input.customerId },
      });

      if (!customer) {
        throw new Error('Заказчик не найден');
      }

      if (customer.role !== 'CUSTOMER') {
        throw new Error('Указанный пользователь не является заказчиком');
      }

      const project = await context.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          customerId: input.customerId,
          startDate: input.startDate ? new Date(input.startDate) : null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        },
        include: {
          customer: true,
          tasks: true,
        },
      });

      return {
        ...project,
        tasksCount: 0,
        completedTasksCount: 0,
        progress: 0,
      };
    },

    // Обновить проект (только для админа)
    updateProject: async (
      _: unknown,
      { id, input }: { id: string; input: { name?: string; description?: string; status?: ProjectStatus; startDate?: string; dueDate?: string } },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      if (context.user.role !== 'ADMIN') {
        throw new Error('Недостаточно прав');
      }

      const existingProject = await context.prisma.project.findUnique({
        where: { id },
      });

      if (!existingProject) {
        throw new Error('Проект не найден');
      }

      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.status !== undefined) {
        updateData.status = input.status;
        // Если статус изменен на COMPLETED, устанавливаем дату завершения
        if (input.status === 'COMPLETED' && !existingProject.completedAt) {
          updateData.completedAt = new Date();
        }
        // Если статус изменен с COMPLETED на другой, убираем дату завершения
        if (input.status !== 'COMPLETED' && existingProject.completedAt) {
          updateData.completedAt = null;
        }
      }
      if (input.startDate !== undefined) updateData.startDate = input.startDate ? new Date(input.startDate) : null;
      if (input.dueDate !== undefined) updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;

      const project = await context.prisma.project.update({
        where: { id },
        data: updateData,
        include: {
          customer: true,
          tasks: true,
        },
      });

      return {
        ...project,
        tasksCount: project.tasks.length,
        completedTasksCount: project.tasks.filter((task) => task.status === 'DONE').length,
        progress: project.tasks.length > 0
          ? Math.round((project.tasks.filter((task) => task.status === 'DONE').length / project.tasks.length) * 100)
          : 0,
      };
    },

    // Удалить проект (только для админа)
    deleteProject: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      if (context.user.role !== 'ADMIN') {
        throw new Error('Недостаточно прав');
      }

      const project = await context.prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new Error('Проект не найден');
      }

      await context.prisma.project.delete({
        where: { id },
      });

      return true;
    },
  },

  Project: {
    customer: async (parent: any, _: unknown, context: GraphQLContext) => {
      if (parent.customer) {
        return parent.customer;
      }
      return context.prisma.user.findUnique({
        where: { id: parent.customerId },
      });
    },
    tasks: async (parent: any, _: unknown, context: GraphQLContext) => {
      if (parent.tasks) {
        return parent.tasks;
      }
      return context.prisma.task.findMany({
        where: { projectId: parent.id },
      });
    },
  },
};
