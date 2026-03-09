# Деплой на Vercel

## ⚠️ Важно: переменные окружения

Проект требует **3 обязательные переменные** в Vercel:

| Переменная | Где взять |
|------------|-----------|
| `DATABASE_URL` | Storage → Postgres → скопировать `POSTGRES_URL_NON_POOLING` |
| `NEXTAUTH_SECRET` | Сгенерировать: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://ваш-проект.vercel.app` |

**Без DATABASE_URL сборка упадёт.** Vercel не создаёт `DATABASE_URL` автоматически — добавьте её вручную.

---

## Локальная разработка

```bash
cp .env.example .env
# Заполните DATABASE_URL (Neon free tier или локальный Postgres)
npm run db:push
npm run db:seed
npm run dev
```

---

## 1. Подготовка базы данных

### Вариант A: Vercel Postgres

1. Vercel Dashboard → проект → **Storage**
2. **Create Database** → **Postgres**
3. Подключите БД к проекту
4. **Обязательно:** Settings → Environment Variables → **Add New**
   - **Key:** `DATABASE_URL`
   - **Value:** скопируйте из `POSTGRES_URL_NON_POOLING` (Storage → ваша БД → вкладка .env)
   - ⚠️ Используйте **NON_POOLING** — pooled URL не поддерживает миграции Prisma

### Вариант B: Neon

1. [neon.tech](https://neon.tech) → создать БД
2. Скопировать connection string (Direct connection, без pgbouncer)
3. В Vercel добавить `DATABASE_URL`

### Вариант C: Supabase

1. [supabase.com](https://supabase.com) → создать проект
2. Settings → Database → Connection string
3. В Vercel добавить `DATABASE_URL`

---

## 2. Все переменные окружения

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Случайная строка (32+ символов) |
| `NEXTAUTH_URL` | ✅ | `https://ваш-домен.vercel.app` |
| `ADMIN_EMAIL` | — | Email админа (для seed) |
| `ADMIN_PASSWORD` | — | Пароль админа (для seed) |
| `TELEGRAM_BOT_TOKEN` | — | Для формы контактов |
| `TELEGRAM_CHAT_ID` | — | Для формы контактов |

---

## 3. Деплой

1. Добавьте все переменные
2. **Deploy** → **Redeploy** (с опцией **Clear Build Cache** если были ошибки)

---

## 4. Создание админа после деплоя

```bash
DATABASE_URL="postgresql://ваш-url-из-vercel" npm run db:seed
```

Или через Prisma Studio:

```bash
DATABASE_URL="..." npx prisma studio
```

---

## 5. Troubleshooting

| Ошибка | Решение |
|--------|---------|
| `Environment variable not found: DIRECT_DATABASE_URL` | Обновите код — эта переменная больше не используется. Redeploy с Clear Cache. |
| `Environment variable not found: DATABASE_URL` | Добавьте DATABASE_URL вручную в Vercel |
| `Can't reach database server` | Проверьте DATABASE_URL, используйте NON_POOLING для Vercel Postgres |
| `Schema migrations` / `connection pooling` | Используйте `POSTGRES_URL_NON_POOLING` вместо `POSTGRES_PRISMA_URL` |

---

## 6. Важно

- **Загрузка файлов** на Vercel недоступна. Используйте URL для фото и видео (Imgur, YouTube, Vimeo)
- **NEXTAUTH_URL** — обновите после деплоя на реальный домен
