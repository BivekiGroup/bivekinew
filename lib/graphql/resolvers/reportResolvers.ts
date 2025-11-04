import { GraphQLContext } from '../context';
import ExcelJS from 'exceljs';
import { uploadToS3 } from '@/lib/s3';

export const reportResolvers = {
  Query: {
    // Отчет по задачам за период
    tasksReport: async (
      _: unknown,
      { startDate, endDate, projectId }: { startDate: string; endDate: string; projectId?: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Конец дня

      // Базовый фильтр по датам
      const where: any = {
        createdAt: {
          gte: start,
          lte: end,
        },
      };

      // Для заказчиков - только их проекты
      if (context.user.role === 'CUSTOMER') {
        const projects = await context.prisma.project.findMany({
          where: { customerId: context.user.id },
          select: { id: true },
        });
        const projectIds = projects.map((p) => p.id);
        where.projectId = { in: projectIds };
      }

      // Фильтр по конкретному проекту (если указан)
      if (projectId) {
        // Проверяем доступ к проекту
        const project = await context.prisma.project.findUnique({
          where: { id: projectId },
        });

        if (!project) {
          throw new Error('Проект не найден');
        }

        if (
          context.user.role !== 'ADMIN' &&
          context.user.role !== 'DEVELOPER' &&
          project.customerId !== context.user.id
        ) {
          throw new Error('Недостаточно прав');
        }

        where.projectId = projectId;
      }

      const tasks = await context.prisma.task.findMany({
        where,
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          assignee: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tasks.map((task) => ({
        task,
        projectName: task.project.name,
        customerName: task.project.customer.name || task.project.customer.email,
      }));
    },

    // Отчет по задачам проекта
    projectTasksReport: async (
      _: unknown,
      { projectId, startDate, endDate }: { projectId: string; startDate?: string; endDate?: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      const project = await context.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          customer: true,
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

      // Фильтр по датам (если указаны)
      const where: any = { projectId };

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        where.createdAt = {
          gte: start,
          lte: end,
        };
      }

      const tasks = await context.prisma.task.findMany({
        where,
        include: {
          assignee: true,
          project: {
            include: {
              customer: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalTimeSpent = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
      const completedTasksCount = tasks.filter((task) => task.status === 'DONE').length;

      return {
        project: {
          ...project,
          tasksCount: tasks.length,
          completedTasksCount,
          progress: tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0,
        },
        tasks,
        totalTimeSpent,
        completedTasksCount,
      };
    },
  },

  Mutation: {
    // Экспорт отчета в Excel
    exportReport: async (
      _: unknown,
      { startDate, endDate, projectId }: { startDate: string; endDate: string; projectId?: string },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new Error('Необходима авторизация');
      }

      const user = context.user;
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const where: any = {
        createdAt: {
          gte: start,
          lte: end,
        },
      };

      // Filter by role
      if (user.role === 'CUSTOMER') {
        const projects = await context.prisma.project.findMany({
          where: { customerId: user.id },
          select: { id: true },
        });
        const projectIds = projects.map((p) => p.id);
        where.projectId = { in: projectIds };
      }

      // Filter by project if specified
      if (projectId) {
        where.projectId = projectId;
      }

      // Fetch tasks (reports)
      const tasks = await context.prisma.task.findMany({
        where,
        include: {
          project: {
            include: {
              customer: true,
            },
          },
          assignee: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Biveki Platform';
      workbook.created = new Date();

      // Sheet 1: Detailed Reports
      const detailSheet = workbook.addWorksheet('Детальные отчеты');

      // Add header row with styling
      detailSheet.columns = [
        { header: 'Дата', key: 'date', width: 12 },
        { header: 'Проект', key: 'project', width: 25 },
        { header: 'Задача', key: 'task', width: 30 },
        { header: 'Исполнитель', key: 'assignee', width: 20 },
        { header: 'Описание работы', key: 'description', width: 40 },
        { header: 'Часы', key: 'hours', width: 10 },
      ];

      // Style header row
      detailSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      detailSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' },
      };
      detailSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data rows
      tasks.forEach((task) => {
        detailSheet.addRow({
          date: new Date(task.createdAt).toLocaleDateString('ru-RU'),
          project: task.project.name,
          task: task.title,
          assignee: task.assignee?.name || task.assignee?.email || 'Не назначен',
          description: task.description || '',
          hours: task.timeSpent || 0,
        });
      });

      // Add borders to all cells
      detailSheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      // Sheet 2: Summary by Day
      const summarySheet = workbook.addWorksheet('Сводка по дням');

      summarySheet.columns = [
        { header: 'Дата', key: 'date', width: 15 },
        { header: 'Часов', key: 'hours', width: 12 },
      ];

      // Style header row
      summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      summarySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF10B981' },
      };
      summarySheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Group tasks by day
      const dayMap = new Map<string, number>();
      tasks.forEach((task) => {
        const dateKey = new Date(task.createdAt).toLocaleDateString('ru-RU');
        const currentHours = dayMap.get(dateKey) || 0;
        dayMap.set(dateKey, currentHours + (task.timeSpent || 0));
      });

      // Add data rows for each day
      let totalHours = 0;
      Array.from(dayMap.entries())
        .sort((a, b) => {
          const dateA = a[0].split('.').reverse().join('-');
          const dateB = b[0].split('.').reverse().join('-');
          return dateA.localeCompare(dateB);
        })
        .forEach(([date, hours]) => {
          summarySheet.addRow({
            date,
            hours,
          });
          totalHours += hours;
        });

      // Add total row
      const totalRow = summarySheet.addRow({
        date: 'ИТОГО:',
        hours: totalHours,
      });

      totalRow.font = { bold: true, size: 12 };
      totalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' },
      };

      // Add borders to all cells
      summarySheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      // Align hours column to center
      summarySheet.getColumn('hours').alignment = { horizontal: 'center' };

      // Generate Excel file buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Upload to S3
      const fileName = `report-${new Date(startDate).toISOString().split('T')[0]}-${new Date(endDate).toISOString().split('T')[0]}.xlsx`;
      const fileUrl = await uploadToS3(
        Buffer.from(buffer),
        fileName,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      return {
        success: true,
        url: fileUrl,
        fileName,
        totalReports: tasks.length,
        totalHours,
      };
    },
  },
};
