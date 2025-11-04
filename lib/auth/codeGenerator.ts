/**
 * Генерирует 6-значный код для авторизации
 */
export function generateAuthCode(): string {
  // Генерируем случайное число от 100000 до 999999
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/**
 * Проверяет валидность кода (6 цифр)
 */
export function isValidAuthCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}
