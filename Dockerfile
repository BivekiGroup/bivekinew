# Базовый образ Node.js
FROM node:20-alpine AS base

# Установка зависимостей для компиляции нативных модулей
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Копируем файлы package
COPY package*.json ./
COPY prisma ./prisma/

# Установка зависимостей
FROM base AS deps
RUN npm ci

# Генерация Prisma Client
RUN npx prisma generate

# Сборка приложения
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Сборка Next.js приложения
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production образ
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Установка прав
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запуск приложения
CMD ["node", "server.js"]
