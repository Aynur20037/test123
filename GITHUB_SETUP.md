# Инструкция по загрузке проекта на GitHub

## Шаг 1: Установка Git (если еще не установлен)

Если Git не установлен, установите Xcode Command Line Tools:
```bash
xcode-select --install
```

## Шаг 2: Настройка Git (первый раз)

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"
```

## Шаг 3: Инициализация репозитория

Выполните в терминале в папке проекта:

```bash
cd /Users/ainur/DevBlog
git init
```

## Шаг 4: Добавление файлов

```bash
git add .
```

## Шаг 5: Создание первого коммита

```bash
git commit -m "Initial commit: DevBlog platform"
```

## Шаг 6: Создание репозитория на GitHub

1. Откройте https://github.com
2. Войдите в свой аккаунт (или создайте новый)
3. Нажмите кнопку "+" в правом верхнем углу
4. Выберите "New repository"
5. Заполните:
   - Repository name: `DevBlog` (или другое имя)
   - Description: "Платформа для технических блогов"
   - Выберите Public или Private
   - НЕ ставьте галочки на "Initialize with README" (у нас уже есть файлы)
6. Нажмите "Create repository"

## Шаг 7: Подключение к GitHub

GitHub покажет вам команды. Выполните (замените YOUR_USERNAME на ваш username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/DevBlog.git
git branch -M main
git push -u origin main
```

Если попросит пароль, используйте Personal Access Token (см. ниже).

## Шаг 8: Создание Personal Access Token (если нужно)

Если GitHub требует токен вместо пароля:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Выберите срок действия и права:
   - `repo` (полный доступ к репозиториям)
4. Скопируйте токен (он показывается только один раз!)
5. Используйте токен вместо пароля при push

## Полезные команды Git

```bash
# Проверить статус
git status

# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить на GitHub
git push

# Получить изменения с GitHub
git pull

# Посмотреть историю
git log
```

## Что НЕ попадет в GitHub (благодаря .gitignore):

- `node_modules/` - зависимости (слишком большие)
- `database.sqlite` - база данных (содержит личные данные)
- `server/uploads/` - загруженные изображения
- `.env` - секретные ключи

## Важно!

После клонирования проекта на другом компьютере:

1. Скопируйте `server/.env.example` в `server/.env`
2. Заполните переменные окружения
3. Выполните `npm run install-all`
4. Запустите `npm run dev`

