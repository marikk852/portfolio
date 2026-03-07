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

## 4. Перезапуск

Перезапустите dev-сервер после изменения `.env`:

```bash
npm run dev
```
