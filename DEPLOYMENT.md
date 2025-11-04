# Деплой через Portainer

## Подготовка

Приложение настроено для деплоя через Portainer с использованием Docker Compose.

### Порты
- **Внешний порт**: 3022 (настраивается через `EXTERNAL_PORT` в stack.env)
- **Внутренний порт контейнера**: 3000

## Файлы конфигурации

1. **Dockerfile** - конфигурация сборки Docker образа
2. **docker-compose.yml** - описание сервисов и конфигурация
3. **stack.env** - переменные окружения (хранится в Git для Portainer)

## Способы деплоя

### Вариант 1: Деплой через Git Repository (рекомендуется)

1. Закоммитьте все изменения в Git репозиторий (включая `stack.env`)
2. В Portainer:
   - Перейдите в **Stacks** → **Add stack**
   - Выберите **Repository**
   - Укажите URL вашего Git репозитория
   - Укажите путь к docker-compose.yml: `docker-compose.yml`
   - Файл `stack.env` автоматически подтянется из репозитория
   - Нажмите **Deploy the stack**

**Примечание:** Файл `stack.env` хранится в репозитории для удобства деплоя через Portainer.

### Вариант 2: Деплой через Web Editor

1. В Portainer:
   - Перейдите в **Stacks** → **Add stack**
   - Выберите **Web editor**
   - Скопируйте содержимое `docker-compose.yml` в редактор
   - Прокрутите вниз до секции **Environment variables**
   - Скопируйте содержимое `stack.env` в поле environment variables
   - Нажмите **Deploy the stack**

### Вариант 3: Деплой через Upload

1. Создайте архив с файлами:
   ```bash
   tar -czf biveki-stack.tar.gz docker-compose.yml stack.env
   ```
2. В Portainer:
   - Перейдите в **Stacks** → **Add stack**
   - Выберите **Upload**
   - Загрузите архив
   - Нажмите **Deploy the stack**

## Переменные окружения

Все переменные окружения находятся в файле `stack.env`:

```env
# Внешний порт
EXTERNAL_PORT=3022

# База данных
DATABASE_URL=postgresql://...

# JWT Secret
JWT_SECRET=...

# SMTP Configuration
SMTP_HOST=smtp.timeweb.ru
SMTP_PORT=465
SMTP_USER=developer@biveki.ru
SMTP_PASS=...
FROM_EMAIL=developer@biveki.ru

# S3 Storage
S3_ENDPOINT=https://s3.twcstorage.ru
S3_REGION=ru-central1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=617774af-biveki

# DaData API
DADATA_API_KEY=...

# Production URL
NEXTAUTH_URL=http://your-domain.com:3022
```

### Важно!

**Перед деплоем в продакшн обязательно измените:**
- `NEXTAUTH_URL` - укажите ваш реальный домен или IP
- При необходимости обновите секретные ключи и пароли

## База данных

Приложение использует внешнюю PostgreSQL базу данных.

### Миграции Prisma

После первого деплоя или изменения схемы базы данных:

```bash
# Войдите в контейнер
docker exec -it biveki-app sh

# Запустите миграции
npx prisma db push

# (Опционально) Заполните начальными данными
npm run db:seed
```

Или из Portainer:
1. Перейдите в **Containers** → выберите контейнер `biveki-app`
2. Нажмите **Console** → **Connect**
3. Выполните команды выше

## Мониторинг

### Health Check

Приложение имеет встроенный health endpoint: `http://localhost:3022/api/health`

Docker compose автоматически проверяет здоровье контейнера каждые 30 секунд.

### Логи

Просмотр логов через Portainer:
1. **Containers** → выберите `biveki-app`
2. Нажмите **Logs**

Или через Docker CLI:
```bash
docker logs -f biveki-app
```

## Обновление приложения

### Через Portainer:
1. Перейдите в **Stacks** → выберите ваш stack
2. Нажмите **Pull and redeploy**
3. Или нажмите **Editor** → внесите изменения → **Update the stack**

### Через Docker CLI:
```bash
docker compose pull
docker compose up -d
```

## Остановка и удаление

### Через Portainer:
1. **Stacks** → выберите stack → **Stop** или **Delete**

### Через Docker CLI:
```bash
# Остановить
docker compose down

# Остановить и удалить volumes
docker compose down -v
```

## Troubleshooting

### Контейнер не запускается
1. Проверьте логи: `docker logs biveki-app`
2. Проверьте переменные окружения в stack.env
3. Убедитесь что порт 3022 не занят другим приложением

### База данных недоступна
1. Проверьте `DATABASE_URL` в stack.env
2. Убедитесь что база данных доступна с хоста
3. Проверьте настройки firewall

### Ошибки сборки
1. Очистите Docker кэш: `docker builder prune -a`
2. Пересоберите образ: `docker compose build --no-cache`

## Безопасность

1. Файл `stack.env` хранится в Git репозитории для деплоя через Portainer
   - ⚠️ Убедитесь что репозиторий **приватный**
   - ⚠️ Не публикуйте репозиторий с реальными секретами
2. Используйте сильные пароли и секретные ключи
3. Регулярно обновляйте зависимости: `npm audit fix`
4. Используйте HTTPS в продакшене (настройте reverse proxy с SSL)
5. Регулярно меняйте пароли и API ключи
6. Ограничьте доступ к Portainer и Git репозиторию

## Производительность

Рекомендуемые ресурсы:
- **CPU**: минимум 1 core, рекомендуется 2+ cores
- **RAM**: минимум 512MB, рекомендуется 1GB+
- **Disk**: минимум 2GB

## Дополнительно

Для настройки reverse proxy (nginx/traefik) с SSL сертификатами обратитесь к документации вашего прокси сервера.
