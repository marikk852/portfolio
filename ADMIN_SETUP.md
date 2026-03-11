# Настройка админки

## 1. Файл `.env` создан

В нём уже есть:
- `NEXTAUTH_SECRET` — сгенерирован
- `NEXTAUTH_URL` — http://localhost:3000
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin@example.com / admin123

## 2. PostgreSQL

Нужна база данных. Варианты:

### Вариант A: Docker (если установлен)

```bash
docker compose up -d postgres
sleep 3
npx prisma db push
npm run db:seed
```

### Вариант B: Neon (бесплатно, без Docker)

1. Зарегистрируйтесь на [neon.tech](https://neon.tech)
2. Создайте проект и скопируйте connection string
3. В `.env` замените `DATABASE_URL` на этот URL
4. Выполните:

```bash
npx prisma db push
npm run db:seed
```

### Вариант C: Локальный PostgreSQL

Если PostgreSQL уже установлен:

```bash
createdb portfolio
# DATABASE_URL в .env должен указывать на вашу БД
npx prisma db push
npm run db:seed
```

## 3. Вход в админку

После успешного seed:

1. Запустите: `npm run dev`
2. Откройте: **http://localhost:3000/admin/login**
3. Логин: `admin@example.com`
4. Пароль: `admin123`
