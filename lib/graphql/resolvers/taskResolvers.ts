import { GraphQLContext } from '../context';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const taskResolvers = {
  Query: {
    // Получить задачи проекта
    tasks: async (_: unknown, { projectId }: { projectId: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      const project = await context.prisma.project.findUnique({
        where: { id: projectId },
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

      return context.prisma.task.findMany({
        where: { projectId },
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          assignee: true,
        },
        orderBy: [
          { status: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    },

    // Получить одну задачу
    task: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      const task = await context.prisma.task.findUnique({
        where: { id },
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          assignee: true,
        },
      });

      if (!task) {
        throw new Error('Задача не найдена');
      }

      // Проверка прав доступа
      if (
        context.user.role !== 'ADMIN' &&
        context.user.role !== 'DEVELOPER' &&
        task.project.customerId !== context.user.id &&
        task.assigneeId !== context.user.id
      ) {
        throw new Error('Недостаточно прав');
      }

      return task;
    },

    // Получить задачи текущего пользователя
    myTasks: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      // Для заказчиков - все задачи их проектов
      if (context.user.role === 'CUSTOMER') {
        const projects = await context.prisma.project.findMany({
          where: { customerId: context.user.id },
          select: { id: true },
        });

        const projectIds = projects.map((p) => p.id);

        return context.prisma.task.findMany({
          where: { projectId: { in: projectIds } },
          include: {
            project: {
              include: {
                customer: true,
              },
            },
            assignee: true,
          },
          orderBy: [
            { status: 'asc' },
            { priority: 'desc' },
            { createdAt: 'desc' },
          ],
        });
      }

      // Для разработчиков - назначенные им задачи
      return context.prisma.task.findMany({
        where: { assigneeId: context.user.id },
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          assignee: true,
        },
        orderBy: [
          { status: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    },
  },

  Mutation: {
    // Создать задачу (только для админа)
    createTask: async (
      _: unknown,
      { input }: {
        input: {
          title: string;
          description?: string;
          projectId: string;
          priority?: TaskPriority;
          assigneeId?: string;
          timeSpent?: number;
          dueDate?: string
        }
      },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      if (context.user.role !== 'ADMIN') {
        throw new Error('Недостаточно прав');
      }

      // Проверяем существование проекта
      const project = await context.prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project) {
        throw new Error('Проект не найден');
      }

      // Проверяем существование исполнителя, если указан
      if (input.assigneeId) {
        const assignee = await context.prisma.user.findUnique({
          where: { id: input.assigneeId },
        });

        if (!assignee) {
          throw new Error('Исполнитель не найден');
        }

        if (assignee.role !== 'DEVELOPER' && assignee.role !== 'ADMIN') {
          throw new Error('Исполнителем может быть только разработчик или администратор');
        }
      }

      const task = await context.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          projectId: input.projectId,
          priority: input.priority || 'MEDIUM',
          assigneeId: input.assigneeId,
          timeSpent: input.timeSpent || 0,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        },
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          assignee: true,
        },
      });

      return task;
    },

    // Обновить задачу (только для админа)
    updateTask: async (
      _: unknown,
      { id, input }: {
        id: string;
        input: {
          title?: string;
          description?: string;
          status?: TaskStatus;
          priority?: TaskPriority;
          assigneeId?: string;
          timeSpent?: number;
          dueDate?: string
        }
      },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      if (context.user.role !== 'ADMIN') {
        throw new Error('Недостаточно прав');
      }

      const existingTask = await context.prisma.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        throw new Error('Задача не найдена');
      }

      const updateData: any = {};

      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.priority !== undefined) updateData.priority = input.priority;
      if (input.status !== undefined) {
        updateData.status = input.status;
        // Если статус изменен на DONE, устанавливаем дату завершения
        if (input.status === 'DONE' && !existingTask.completedAt) {
          updateData.completedAt = new Date();
        }
        // Если статус изменен с DONE на другой, убираем дату завершения
        if (input.status !== 'DONE' && existingTask.completedAt) {
          updateData.completedAt = null;
        }
      }
      if (input.timeSpent !== undefined) updateData.timeSpent = input.timeSpent;
      if (input.dueDate !== undefined) updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;

      // Проверяем существование исполнителя, если указан
      if (input.assigneeId !== undefined) {
        if (input.assigneeId) {
          const assignee = await context.prisma.user.findUnique({
            where: { id: input.assigneeId },
          });

          if (!assignee) {
            throw new Error('Исполнитель не найден');
          }

          if (assignee.role !== 'DEVELOPER' && assignee.role !== 'ADMIN') {
            throw new Error('Исполнителем может быть только разработчик или администратор');
          }
        }
        updateData.assigneeId = input.assigneeId;
      }

      const task = await context.prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          assignee: true,
        },
      });

      return task;
    },

    // Удалить задачу (только для админа)
    deleteTask: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      if (context.user.role !== 'ADMIN') {
        throw new Error('Недостаточно прав');
      }

      const task = await context.prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new Error('Задача не найдена');
      }

      await context.prisma.task.delete({
        where: { id },
      });

      return true;
    },
  },

  Task: {
    project: async (parent: any, _: unknown, context: GraphQLContext) => {
      if (parent.project) {
        return parent.project;
      }
      return context.prisma.project.findUnique({
        where: { id: parent.projectId },
        include: {
          customer: true,
        },
      });
    },
    assignee: async (parent: any, _: unknown, context: GraphQLContext) => {
      if (parent.assignee !== undefined) {
        return parent.assignee;
      }
      if (!parent.assigneeId) {
        return null;
      }
      return context.prisma.user.findUnique({
        where: { id: parent.assigneeId },
      });
    },
  },
};
