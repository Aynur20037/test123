# DevBlog - Платформа для технических блогов

Полнофункциональная платформа для создания и публикации технических блогов с системой комментариев, подписок и административной панелью.

## Возможности

- ✅ Регистрация и аутентификация (читатели, авторы, администраторы)
- ✅ Создание, редактирование и удаление статей
- ✅ Markdown редактор с предпросмотром
- ✅ Загрузка изображений для статей
- ✅ Система комментариев
- ✅ Теги и категории
- ✅ Подписки на авторов
- ✅ Поиск по статьям
- ✅ Административная панель
- ✅ Адаптивный дизайн

## Технологии

### Backend
- Node.js + Express
- SQLite (Sequelize ORM)
- JWT аутентификация
- Multer для загрузки файлов

### Frontend
- React 18
- React Router
- Vite
- Axios
- React Markdown
- React Syntax Highlighter
- React Hot Toast

## Установка

1. Клонируйте репозиторий или перейдите в папку проекта

2. Установите зависимости:
```bash
npm run install-all
```

3. Создайте файл `.env` в папке `server`:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

4. Запустите проект:
```bash
npm run dev
```

Это запустит:
- Backend сервер на http://localhost:5000
- Frontend приложение на http://localhost:3000

## Структура проекта

```
DevBlog/
├── server/              # Backend
│   ├── config/         # Конфигурация БД
│   ├── models/         # Модели Sequelize
│   ├── routes/         # API маршруты
│   ├── middleware/     # Middleware (auth)
│   └── uploads/        # Загруженные изображения
├── client/             # Frontend
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── pages/      # Страницы
│   │   ├── context/    # React Context
│   │   └── App.jsx     # Главный компонент
└── package.json        # Корневой package.json
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Статьи
- `GET /api/articles` - Список статей (с фильтрацией и поиском)
- `GET /api/articles/:slug` - Получить статью
- `POST /api/articles` - Создать статью (автор)
- `PUT /api/articles/:id` - Обновить статью
- `DELETE /api/articles/:id` - Удалить статью

### Комментарии
- `GET /api/comments/article/:articleId` - Комментарии к статье
- `POST /api/comments` - Создать комментарий
- `PUT /api/comments/:id` - Обновить комментарий
- `DELETE /api/comments/:id` - Удалить комментарий

### Категории и теги
- `GET /api/categories` - Список категорий
- `POST /api/categories` - Создать категорию (админ)
- `GET /api/tags` - Список тегов

### Подписки
- `POST /api/subscriptions/:authorId` - Подписаться
- `DELETE /api/subscriptions/:authorId` - Отписаться
- `GET /api/subscriptions/my` - Мои подписки

### Пользователи
- `GET /api/users/:id` - Профиль пользователя
- `PUT /api/users/:id` - Обновить профиль

## Роли пользователей

- **Reader** - Читатель, может читать статьи и оставлять комментарии
- **Author** - Автор, может создавать и редактировать свои статьи
- **Admin** - Администратор, полный доступ ко всем функциям

## Разработка

Для разработки используйте:
```bash
npm run dev
```

Для сборки production версии:
```bash
npm run build
```

## Лицензия

MIT

