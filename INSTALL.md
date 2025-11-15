# Инструкция по установке DevBlog

## Шаг 1: Установка Node.js

Если Node.js не установлен, выберите один из способов:

### Способ 1: Через Homebrew (рекомендуется)

```bash
# Установите Homebrew (если еще не установлен)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установите Node.js
brew install node
```

### Способ 2: Через официальный установщик

1. Откройте https://nodejs.org/
2. Скачайте LTS версию для macOS
3. Запустите установщик

### Способ 3: Через nvm

```bash
# Установите nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезагрузите терминал или выполните:
source ~/.zshrc

# Установите Node.js
nvm install --lts
nvm use --lts
```

## Шаг 2: Проверка установки

После установки Node.js выполните:

```bash
node --version
npm --version
```

Должны отобразиться версии Node.js и npm.

## Шаг 3: Установка зависимостей проекта

```bash
cd /Users/ainur/DevBlog
npm run install-all
```

## Шаг 4: Настройка окружения

Создайте файл `.env` в папке `server`:

```bash
cd server
cat > .env << EOF
PORT=5000
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
EOF
```

## Шаг 5: Запуск проекта

```bash
cd /Users/ainur/DevBlog
npm run dev
```

Это запустит:
- Backend сервер на http://localhost:5000
- Frontend приложение на http://localhost:3000

## Решение проблем

### Ошибка "command not found: npm"
- Убедитесь, что Node.js установлен: `node --version`
- Если Node.js установлен, но npm не работает, переустановите Node.js

### Ошибки при установке зависимостей
- Убедитесь, что у вас установлена последняя версия Node.js (рекомендуется 18.x или выше)
- Попробуйте очистить кэш: `npm cache clean --force`
- Удалите `node_modules` и `package-lock.json` и попробуйте снова

### Порт уже занят
- Измените порт в файле `.env` (для backend)
- Измените порт в `client/vite.config.js` (для frontend)

