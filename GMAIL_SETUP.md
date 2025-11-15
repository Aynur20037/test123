# Настройка Gmail для восстановления пароля

## Шаг 1: Включение двухфакторной аутентификации

1. Откройте https://myaccount.google.com/security
2. Включите "Двухэтапную аутентификацию" (если еще не включена)

## Шаг 2: Создание App Password

1. Перейдите на: https://myaccount.google.com/apppasswords
2. Выберите "Пароли приложений"
3. Выберите приложение: "Почта"
4. Выберите устройство: "Другое (произвольное имя)"
5. Введите имя: "DevBlog"
6. Нажмите "Создать"
7. **Скопируйте 16-значный пароль** (он показывается только один раз!)

## Шаг 3: Настройка .env файла

Откройте файл `/Users/ainur/DevBlog/server/.env` и добавьте:

```env
GMAIL_USER=ваш-email@gmail.com
GMAIL_APP_PASSWORD=ваш-16-значный-пароль-приложения
FRONTEND_URL=http://localhost:3000
```

**Важно:**
- Используйте **App Password**, а не обычный пароль Gmail
- App Password выглядит как: `abcd efgh ijkl mnop` (16 символов без пробелов)

## Шаг 4: Проверка

После настройки перезапустите сервер:

```bash
cd /Users/ainur/DevBlog/server
npm start
```

## Альтернатива: Использование других почтовых сервисов

Если не хотите использовать Gmail, можно настроить другие:

### Mailgun
```env
MAILGUN_API_KEY=your-api-key
MAILGUN_DOMAIN=your-domain.com
```

### SendGrid
```env
SENDGRID_API_KEY=your-api-key
```

### SMTP (любой почтовый сервер)
В файле `server/utils/email.js` измените настройки транспортера.

## Безопасность

- Никогда не коммитьте `.env` файл в Git
- Используйте App Password, а не основной пароль
- Храните секреты в безопасном месте

