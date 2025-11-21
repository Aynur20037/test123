const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const ROOT_SSH = {
  user: 'root',
  password: 'demo123',
  host: '127.0.0.1'
};
const demoComments = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/api/demo-comments', (req, res) => {
  res.json(demoComments);
});

app.post('/api/demo-comments', (req, res) => {
  const { content = '' } = req.body || {};
  const comment = {
    id: Date.now(),
    content
  };
  demoComments.unshift(comment);
  res.json(comment);
});

// VULNERABLE: OS Command Injection
app.post('/api/admin/ping', (req, res) => {
  const ip = req.body.ip;
  
  exec(`ping -c 1 ${ip}`, (error, stdout, stderr) => {
    if (error) {
      return res.send(`Error: ${stderr}`);
    }
    res.send(`Result: ${stdout}`);
  });
});

// VULNERABLE: Path Traversal (LFI)
app.get('/api/logs', (req, res) => {
  const filename = req.query.file;
  
  // VULNERABLE: Allows reading any file on the server
  const filePath = path.join(__dirname, 'logs', filename);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.send("File not found or Access Denied (Try ../package.json)");
    res.send(data);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/subscriptions', require('./routes/subscriptions'));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

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

