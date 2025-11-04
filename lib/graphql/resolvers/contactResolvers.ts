import { GraphQLError } from 'graphql';
import { ContactStatus } from '@prisma/client';
import { sendContactFormNotification } from '@/lib/email/emailService';
import type { GraphQLContext } from '../context';

interface SubmitContactFormInput {
  name: string;
  email: string;
  phone?: string;
  project: string;
}

export const contactResolvers = {
  Query: {
    // Получить все заявки (только для админов)
    contactForms: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'DEVELOPER') {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return await context.prisma.contactForm.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    },

    // Получить одну заявку по ID (только для админов)
    contactForm: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'DEVELOPER') {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return await context.prisma.contactForm.findUnique({
        where: { id },
      });
    },
  },

  Mutation: {
    // Отправить заявку (публичная мутация)
    submitContactForm: async (
      _: unknown,
      { input }: { input: SubmitContactFormInput },
      context: GraphQLContext
    ) => {
      const { name, email, phone, project } = input;

      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new GraphQLError('Invalid email format', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Валидация имени
      if (name.trim().length < 2) {
        throw new GraphQLError('Name must be at least 2 characters', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Валидация описания проекта
      if (project.trim().length < 10) {
        throw new GraphQLError('Project description must be at least 10 characters', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      try {
        // Получаем IP адрес и User Agent из контекста
        const ipAddress = context.ip || null;
        const userAgent = context.userAgent || null;

        // Создаем заявку в БД
        await context.prisma.contactForm.create({
          data: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone?.trim() || null,
            project: project.trim(),
            ipAddress,
            userAgent,
          },
        });

        // Отправляем уведомление админу
        try {
          await sendContactFormNotification(
            name.trim(),
            email.toLowerCase().trim(),
            phone?.trim() || null,
            project.trim()
          );
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
          // Не бросаем ошибку, так как заявка уже сохранена в БД
        }

        return {
          success: true,
          message: 'Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.',
        };
      } catch (error) {
        console.error('Error submitting contact form:', error);
        throw new GraphQLError('Failed to submit contact form', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    // Обновить статус заявки (только для админов)
    updateContactFormStatus: async (
      _: unknown,
      { id, status }: { id: string; status: ContactStatus },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (context.user.role !== 'ADMIN' && context.user.role !== 'DEVELOPER') {
        throw new GraphQLError('Not authorized', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return await context.prisma.contactForm.update({
        where: { id },
        data: { status },
      });
    },
  },
};
