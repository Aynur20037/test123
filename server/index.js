const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// Database
const db = require('./config/database');
db.authenticate()
  .then(() => {
    console.log('✅ Подключение к базе данных установлено');
    // Используем force: false чтобы не пересоздавать таблицы
    return db.sync({ force: false });
  })
  .then(() => {
    console.log('✅ Модели синхронизированы');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Ошибка подключения к базе данных:', err);
    // Пытаемся запустить сервер даже при ошибке синхронизации
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT} (с предупреждениями)`);
    });
  });

