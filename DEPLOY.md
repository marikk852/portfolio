# Деплой на Vercel

## Локальная разработка

Для локальной разработки нужен PostgreSQL:

```bash
# Скопируйте .env.example в .env
cp .env.example .env

# Заполните DATABASE_URL и DIRECT_DATABASE_URL (Neon free tier или локальный Postgres)
# Затем:
npm run db:push
npm run db:seed
npm run dev
```

---

## 1. Подготовка базы данных

Проект использует **PostgreSQL**. Варианты:

### Вариант A: Vercel Postgres (рекомендуется)

1. В [Vercel Dashboard](https://vercel.com) → ваш проект → **Storage**
2. **Create Database** → **Postgres**
3. Подключите БД к проекту
4. Vercel создаст переменные `POSTGRES_PRISMA_URL` и `POSTGRES_URL_NON_POOLING`
5. Добавьте в **Settings → Environment Variables**:
   - `DATABASE_URL` = значение из `POSTGRES_PRISMA_URL`
   - `DIRECT_DATABASE_URL` = значение из `POSTGRES_URL_NON_POOLING`

### Вариант B: Neon (бесплатный tier)

1. Создайте БД на [neon.tech](https://neon.tech)
2. Скопируйте connection string (pooled и direct)
3. В Vercel добавьте:
   - `DATABASE_URL` = pooled URL (с `?sslmode=require`)
   - `DIRECT_DATABASE_URL` = direct URL (без pgbouncer)

### Вариант C: Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. **Settings → Database** → Connection string (Transaction mode и Session mode)
3. В Vercel добавьте оба URL

---

## 2. Переменные окружения в Vercel

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `DIRECT_DATABASE_URL` | ✅ | Прямой URL для миграций |
| `NEXTAUTH_SECRET` | ✅ | Случайная строка (32+ символов) |
| `NEXTAUTH_URL` | ✅ | `https://ваш-домен.vercel.app` |
| `ADMIN_EMAIL` | — | Email админа (для seed) |
| `ADMIN_PASSWORD` | — | Пароль админа (для seed) |
| `TELEGRAM_BOT_TOKEN` | — | Для формы контактов |
| `TELEGRAM_CHAT_ID` | — | Для формы контактов |

---

## 3. Первый деплой

1. Подключите репозиторий GitHub к Vercel
2. Добавьте все переменные окружения
3. **Deploy**

Миграции выполнятся автоматически при сборке.

---

## 4. Создание админа после деплоя

Выполните seed локально, указав production DATABASE_URL:

```bash
DATABASE_URL="postgresql://..." DIRECT_DATABASE_URL="postgresql://..." npm run db:seed
```

Или создайте пользователя через Prisma Studio:

```bash
DATABASE_URL="..." npx prisma studio
```

---

## 5. Важно

- **Загрузка файлов**: на Vercel недоступна (файловая система read-only). Используйте URL для фото и видео (Imgur, YouTube, Vimeo и т.д.)
- **NEXTAUTH_URL**: после деплоя обновите на реальный домен
