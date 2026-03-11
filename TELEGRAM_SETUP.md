# Настройка Telegram-бота для формы контактов

## 1. Создание бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Введите имя бота (например: Portfolio Contact Bot)
4. Введите username бота (например: my_portfolio_contact_bot)
5. Скопируйте выданный **токен** (например: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 2. Получение Chat ID

**Вариант A — личные сообщения:**
1. Напишите боту любое сообщение
2. Откройте в браузере: `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
3. Найдите `"chat":{"id":123456789}` — это ваш Chat ID

**Вариант B — через @userinfobot:**
1. Напишите [@userinfobot](https://t.me/userinfobot) в Telegram
2. Он пришлёт ваш ID

## 3. Добавление в .env

```env
TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
TELEGRAM_CHAT_ID="123456789"
```

## 4. Группы Telegram

Если Chat ID **отрицательный** (например `-5029608803`) — это группа:

1. **Добавьте бота в группу** — без этого сообщения не дойдут
2. Откройте группу → Добавить участников → найдите бота по username
3. Chat ID группы: добавьте бота, напишите в группу, затем откройте `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `"chat":{"id":-5029608803}`

## 5. Vercel

1. **Project Settings → Environment Variables**
2. Добавьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` (без кавычек в значениях)
3. **Redeploy** — после добавления переменных обязательно redeploy проекта

## 6. Перезапуск

Перезапустите dev-сервер после изменения `.env`:

```bash
npm run dev
```

## 7. Ошибка «Что-то пошло не так»

| Причина | Решение |
|---------|---------|
| Бот не в группе | Добавьте бота в группу как участника |
| Переменные не подхватились | Vercel: Redeploy после добавления env |
| Неверный Chat ID | Для groups: `-5029608803` (с минусом) |
| Неверный токен | Проверьте токен в BotFather |

Проверка: в Vercel → **Deployments** → последний деплой → **Functions** → найдите лог вызова `/api/contact` и посмотрите ошибку.
