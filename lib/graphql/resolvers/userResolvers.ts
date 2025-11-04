import { GraphQLContext, requireAuth, requireAdmin } from '../context';
import { validateOrThrow, createUserSchema, updateUserSchema, uuidSchema } from '../../utils/validation';
import { UserRole } from '@prisma/client';

export const userResolvers = {
  Query: {
    /**
     * Получить текущего пользователя
     */
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAuth(context);

      return {
        id: context.user!.id,
        email: context.user!.email,
        role: context.user!.role,
        name: context.user!.name,
        createdAt: context.user!.createdAt.toISOString(),
        updatedAt: context.user!.updatedAt.toISOString(),
        isActive: context.user!.isActive,
        phone: context.user!.phone,
        avatar: context.user!.avatar,
        clientType: context.user!.clientType,
        inn: context.user!.inn,
        bik: context.user!.bik,
        accountNumber: context.user!.accountNumber,
        fullName: context.user!.fullName,
        companyName: context.user!.companyName,
        kpp: context.user!.kpp,
        ogrn: context.user!.ogrn,
        legalAddress: context.user!.legalAddress,
        bankName: context.user!.bankName,
        corrAccount: context.user!.corrAccount,
      };
    },

    /**
     * Получить всех пользователей (только для админа)
     */
    users: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAdmin(context);

      const users = await context.prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        isActive: user.isActive,
        phone: user.phone,
        avatar: user.avatar,
        clientType: user.clientType,
        inn: user.inn,
        bik: user.bik,
        accountNumber: user.accountNumber,
        fullName: user.fullName,
        companyName: user.companyName,
        kpp: user.kpp,
        ogrn: user.ogrn,
        legalAddress: user.legalAddress,
        bankName: user.bankName,
        corrAccount: user.corrAccount,
      }));
    },

    /**
     * Получить пользователя по ID (только для админа)
     */
    user: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      requireAdmin(context);

      const validatedId = validateOrThrow(uuidSchema, id);

      const user = await context.prisma.user.findUnique({
        where: { id: validatedId },
      });

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        isActive: user.isActive,
        phone: user.phone,
        avatar: user.avatar,
        clientType: user.clientType,
        inn: user.inn,
        bik: user.bik,
        accountNumber: user.accountNumber,
        fullName: user.fullName,
        companyName: user.companyName,
        kpp: user.kpp,
        ogrn: user.ogrn,
        legalAddress: user.legalAddress,
        bankName: user.bankName,
        corrAccount: user.corrAccount,
      };
    },
  },

  Mutation: {
    /**
     * Создать нового пользователя (только для админа)
     */
    createUser: async (
      _: unknown,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      try {
        requireAdmin(context);

        // Валидация
        const validated = validateOrThrow(createUserSchema, input);

        // Проверяем, не существует ли уже пользователь с таким email
        const existingUser = await context.prisma.user.findUnique({
          where: { email: validated.email },
        });

        if (existingUser) {
          return {
            success: false,
            message: 'Пользователь с таким email уже существует',
          };
        }

        // Создаем пользователя
        const user = await context.prisma.user.create({
          data: {
            email: validated.email,
            role: validated.role,
            name: validated.name,
            clientType: input.clientType,
            inn: input.inn,
            bik: input.bik,
            accountNumber: input.accountNumber,
            fullName: input.fullName,
            companyName: input.companyName,
            kpp: input.kpp,
            ogrn: input.ogrn,
            legalAddress: input.legalAddress,
            bankName: input.bankName,
            corrAccount: input.corrAccount,
          },
        });

        return {
          success: true,
          message: 'Пользователь успешно создан',
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
        console.error('Error in createUser:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Ошибка создания пользователя',
        };
      }
    },

    /**
     * Обновить пользователя (только для админа)
     */
    updateUser: async (
      _: unknown,
      args: { id: string; email?: string; name?: string; role?: UserRole; isActive?: boolean },
      context: GraphQLContext
    ) => {
      requireAdmin(context);

      const validatedId = validateOrThrow(uuidSchema, args.id);

      // Проверяем существование пользователя
      const existingUser = await context.prisma.user.findUnique({
        where: { id: validatedId },
      });

      if (!existingUser) {
        throw new Error('Пользователь не найден');
      }

      // Если меняется email, проверяем уникальность
      if (args.email && args.email !== existingUser.email) {
        const emailExists = await context.prisma.user.findUnique({
          where: { email: args.email },
        });

        if (emailExists) {
          throw new Error('Пользователь с таким email уже существует');
        }
      }

      // Валидация данных для обновления
      const updateData = validateOrThrow(updateUserSchema, {
        email: args.email,
        name: args.name,
        role: args.role,
        isActive: args.isActive,
      });

      // Обновляем пользователя
      const user = await context.prisma.user.update({
        where: { id: validatedId },
        data: updateData,
      });

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        isActive: user.isActive,
      };
    },

    /**
     * Обновить реквизиты пользователя (только для админа)
     */
    updateUserRequisites: async (
      _: unknown,
      { id, input }: { id: string; input: any },
      context: GraphQLContext
    ) => {
      requireAdmin(context);

      const validatedId = validateOrThrow(uuidSchema, id);

      // Проверяем существование пользователя
      const existingUser = await context.prisma.user.findUnique({
        where: { id: validatedId },
      });

      if (!existingUser) {
        throw new Error('Пользователь не найден');
      }

      // Обновляем реквизиты
      const user = await context.prisma.user.update({
        where: { id: validatedId },
        data: {
          name: input.name !== undefined ? input.name : undefined,
          phone: input.phone !== undefined ? input.phone : undefined,
          avatar: input.avatar !== undefined ? input.avatar : undefined,
          clientType: input.clientType !== undefined ? input.clientType : undefined,
          inn: input.inn !== undefined ? input.inn : undefined,
          bik: input.bik !== undefined ? input.bik : undefined,
          accountNumber: input.accountNumber !== undefined ? input.accountNumber : undefined,
          fullName: input.fullName !== undefined ? input.fullName : undefined,
          companyName: input.companyName !== undefined ? input.companyName : undefined,
          kpp: input.kpp !== undefined ? input.kpp : undefined,
          ogrn: input.ogrn !== undefined ? input.ogrn : undefined,
          legalAddress: input.legalAddress !== undefined ? input.legalAddress : undefined,
          bankName: input.bankName !== undefined ? input.bankName : undefined,
          corrAccount: input.corrAccount !== undefined ? input.corrAccount : undefined,
        },
      });

      return user;
    },

    /**
     * Удалить пользователя (только для админа)
     */
    deleteUser: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
      requireAdmin(context);

      const validatedId = validateOrThrow(uuidSchema, id);

      // Проверяем, что пользователь не удаляет сам себя
      if (validatedId === context.user!.id) {
        throw new Error('Невозможно удалить свой собственный аккаунт');
      }

      // Проверяем существование пользователя
      const user = await context.prisma.user.findUnique({
        where: { id: validatedId },
      });

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      // Удаляем пользователя (каскадное удаление удалит также authCodes и sessions)
      await context.prisma.user.delete({
        where: { id: validatedId },
      });

      return true;
    },

    /**
     * Обновить свой профиль (любой пользователь)
     */
    updateProfile: async (
      _: unknown,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const userId = context.user!.id;

      // Обновляем профиль пользователя
      const user = await context.prisma.user.update({
        where: { id: userId },
        data: {
          name: input.name !== undefined ? input.name : undefined,
          phone: input.phone !== undefined ? input.phone : undefined,
          avatar: input.avatar !== undefined ? input.avatar : undefined,
          clientType: input.clientType !== undefined ? input.clientType : undefined,
          inn: input.inn !== undefined ? input.inn : undefined,
          bik: input.bik !== undefined ? input.bik : undefined,
          accountNumber: input.accountNumber !== undefined ? input.accountNumber : undefined,
          fullName: input.fullName !== undefined ? input.fullName : undefined,
          companyName: input.companyName !== undefined ? input.companyName : undefined,
          kpp: input.kpp !== undefined ? input.kpp : undefined,
          ogrn: input.ogrn !== undefined ? input.ogrn : undefined,
          legalAddress: input.legalAddress !== undefined ? input.legalAddress : undefined,
          bankName: input.bankName !== undefined ? input.bankName : undefined,
          corrAccount: input.corrAccount !== undefined ? input.corrAccount : undefined,
        },
      });

      return user;
    },
  },
};
