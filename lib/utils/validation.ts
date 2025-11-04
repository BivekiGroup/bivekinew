import { z } from 'zod';
import { UserRole } from '@prisma/client';

// Валидация email
export const emailSchema = z
  .string()
  .email('Некорректный email адрес')
  .min(3, 'Email должен содержать минимум 3 символа')
  .max(255, 'Email не должен превышать 255 символов')
  .toLowerCase()
  .trim();

// Валидация кода авторизации
export const authCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Код должен состоять из 6 цифр');

// Валидация имени
export const nameSchema = z
  .string()
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(100, 'Имя не должно превышать 100 символов')
  .trim()
  .optional();

// Валидация роли
export const roleSchema = z.nativeEnum(UserRole, {
  message: 'Некорректная роль пользователя',
});

// Валидация для создания пользователя
export const createUserSchema = z.object({
  email: emailSchema,
  role: roleSchema,
  name: nameSchema,
});

// Валидация для обновления пользователя
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  name: nameSchema,
  role: roleSchema.optional(),
  isActive: z.boolean().optional(),
});

// Валидация ID
export const uuidSchema = z.string().uuid('Некорректный ID');

/**
 * Безопасная валидация с возвратом ошибок
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => err.message).join(', ');
      throw new Error(`Ошибка валидации: ${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Проверка валидности без выброса ошибки
 */
export function isValid<T>(schema: z.ZodSchema<T>, data: unknown): boolean {
  const result = schema.safeParse(data);
  return result.success;
}
