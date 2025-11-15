const { User, Article, Category, Tag, sequelize } = require('../models');

async function addAuthors() {
  try {
    console.log('🌱 Добавление новых авторов и статей...');

    // Создаем автора 1: девнуржан (Python, MATLAB, Django)
    let author1 = await User.findOne({ where: { email: 'devnurjan@devblog.com' } });
    if (!author1) {
      author1 = await User.create({
        username: 'девнуржан',
        email: 'devnurjan@devblog.com',
        password: 'password123',
        role: 'author',
        bio: 'Разработчик, специализирующийся на Python, MATLAB и Django'
      });
      console.log('✅ Автор "девнуржан" создан');
    }

    // Создаем автора 2: асхатразраб (SQL)
    let author2 = await User.findOne({ where: { email: 'askhatrazrab@devblog.com' } });
    if (!author2) {
      author2 = await User.create({
        username: 'асхатразраб',
        email: 'askhatrazrab@devblog.com',
        password: 'password123',
        role: 'author',
        bio: 'Эксперт по базам данных и SQL'
      });
      console.log('✅ Автор "асхатразраб" создан');
    }

    // Создаем категории, если их нет
    let pythonCategory = await Category.findOne({ where: { slug: 'python' } });
    if (!pythonCategory) {
      pythonCategory = await Category.create({
        name: 'Python',
        slug: 'python',
        description: 'Статьи о Python и его фреймворках'
      });
    }

    let sqlCategory = await Category.findOne({ where: { slug: 'sql' } });
    if (!sqlCategory) {
      sqlCategory = await Category.create({
        name: 'SQL',
        slug: 'sql',
        description: 'Статьи о базах данных и SQL'
      });
    }

    // Создаем теги
    const tagsData = [
      { name: 'Python', slug: 'python' },
      { name: 'MATLAB', slug: 'matlab' },
      { name: 'Django', slug: 'django' },
      { name: 'SQL', slug: 'sql' },
      { name: 'Базы данных', slug: 'bazy-dannyh' },
      { name: 'Веб-разработка', slug: 'veb-razrabotka' }
    ];

    const tags = {};
    for (const tagData of tagsData) {
      let tag = await Tag.findOne({ where: { slug: tagData.slug } });
      if (!tag) {
        tag = await Tag.create(tagData);
      }
      tags[tagData.slug] = tag;
    }
    console.log('✅ Теги созданы');

    // Статьи для девнуржан (Python, MATLAB, Django)
    
    // Статья 1: Python основы
    const article1Exists = await Article.findOne({ where: { slug: 'osnovy-python-dlya-nachinayushchih' } });
    if (!article1Exists) {
      const article1 = await Article.create({
        title: 'Основы Python для начинающих',
        slug: 'osnovy-python-dlya-nachinayushchih',
        content: `# Основы Python для начинающих

Python — это высокоуровневый язык программирования, который отлично подходит для начинающих.

## Установка Python

\`\`\`bash
# Проверка версии
python --version
\`\`\`

## Первая программа

\`\`\`python
print("Привет, мир!")
\`\`\`

## Переменные и типы данных

\`\`\`python
# Числа
age = 25
price = 19.99

# Строки
name = "Иван"
message = 'Привет'

# Списки
fruits = ['яблоко', 'банан', 'апельсин']

# Словари
person = {
    'name': 'Иван',
    'age': 25
}
\`\`\`

## Условия

\`\`\`python
if age >= 18:
    print("Совершеннолетний")
else:
    print("Несовершеннолетний")
\`\`\`

## Циклы

\`\`\`python
# Цикл for
for fruit in fruits:
    print(fruit)

# Цикл while
i = 0
while i < 5:
    print(i)
    i += 1
\`\`\`

## Функции

\`\`\`python
def greet(name):
    return f"Привет, {name}!"

print(greet("Иван"))
\`\`\`

Python прост в изучении и очень мощный!`,
        excerpt: 'Изучаем основы Python: переменные, типы данных, условия, циклы и функции. Отличный старт для начинающих программистов.',
        categoryId: pythonCategory.id,
        authorId: author1.id,
        published: true
      });
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article1.id, tags['python'].id] }
      );
      console.log('✅ Статья "Основы Python для начинающих" создана');
    }

    // Статья 2: MATLAB
    const article2Exists = await Article.findOne({ where: { slug: 'rabota-s-matlab' } });
    if (!article2Exists) {
      const article2 = await Article.create({
        title: 'Работа с MATLAB: основы и примеры',
        slug: 'rabota-s-matlab',
        content: `# Работа с MATLAB: основы и примеры

MATLAB — это мощная среда для численных вычислений и визуализации данных.

## Основы MATLAB

### Переменные

\`\`\`matlab
% Скаляр
x = 5;

% Вектор
v = [1, 2, 3, 4, 5];

% Матрица
A = [1, 2; 3, 4];
\`\`\`

### Операции с матрицами

\`\`\`matlab
% Сложение
C = A + B;

% Умножение
D = A * B;

% Транспонирование
A_transpose = A';
\`\`\`

### Построение графиков

\`\`\`matlab
x = 0:0.1:10;
y = sin(x);
plot(x, y);
title('График синуса');
xlabel('x');
ylabel('y');
\`\`\`

### Функции

\`\`\`matlab
function result = myFunction(x, y)
    result = x^2 + y^2;
end
\`\`\`

MATLAB отлично подходит для научных вычислений и анализа данных!`,
        excerpt: 'Изучаем основы работы с MATLAB: переменные, матрицы, графики и функции. Практические примеры для начинающих.',
        categoryId: pythonCategory.id,
        authorId: author1.id,
        published: true
      });
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article2.id, tags['matlab'].id] }
      );
      console.log('✅ Статья "Работа с MATLAB" создана');
    }

    // Статья 3: Django
    const article3Exists = await Article.findOne({ where: { slug: 'django-veb-freymvork' } });
    if (!article3Exists) {
      const article3 = await Article.create({
        title: 'Django: веб-фреймворк для Python',
        slug: 'django-veb-freymvork',
        content: `# Django: веб-фреймворк для Python

Django — это мощный веб-фреймворк для быстрой разработки приложений на Python.

## Установка

\`\`\`bash
pip install django
django-admin --version
\`\`\`

## Создание проекта

\`\`\`bash
django-admin startproject myproject
cd myproject
python manage.py runserver
\`\`\`

## Создание приложения

\`\`\`bash
python manage.py startapp myapp
\`\`\`

## Модели

\`\`\`python
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
\`\`\`

## Представления (Views)

\`\`\`python
from django.shortcuts import render
from .models import Article

def article_list(request):
    articles = Article.objects.all()
    return render(request, 'articles/list.html', {'articles': articles})
\`\`\`

## URL-маршруты

\`\`\`python
from django.urls import path
from . import views

urlpatterns = [
    path('articles/', views.article_list, name='article_list'),
]
\`\`\`

Django упрощает создание веб-приложений!`,
        excerpt: 'Изучаем Django: установка, создание проекта, модели, представления и URL-маршруты. Практическое руководство.',
        categoryId: pythonCategory.id,
        authorId: author1.id,
        published: true
      });
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article3.id, tags['django'].id] }
      );
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article3.id, tags['python'].id] }
      );
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article3.id, tags['veb-razrabotka'].id] }
      );
      console.log('✅ Статья "Django: веб-фреймворк для Python" создана');
    }

    // Статьи для асхатразраб (SQL)
    
    // Статья 4: SQL основы
    const article4Exists = await Article.findOne({ where: { slug: 'osnovy-sql' } });
    if (!article4Exists) {
      const article4 = await Article.create({
        title: 'Основы SQL для начинающих',
        slug: 'osnovy-sql',
        content: `# Основы SQL для начинающих

SQL (Structured Query Language) — язык для работы с базами данных.

## SELECT - выборка данных

\`\`\`sql
-- Выбрать все записи
SELECT * FROM users;

-- Выбрать конкретные колонки
SELECT name, email FROM users;

-- С условием
SELECT * FROM users WHERE age > 18;
\`\`\`

## INSERT - вставка данных

\`\`\`sql
INSERT INTO users (name, email, age)
VALUES ('Иван', 'ivan@example.com', 25);
\`\`\`

## UPDATE - обновление данных

\`\`\`sql
UPDATE users
SET age = 26
WHERE name = 'Иван';
\`\`\`

## DELETE - удаление данных

\`\`\`sql
DELETE FROM users
WHERE age < 18;
\`\`\`

## JOIN - соединение таблиц

\`\`\`sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
\`\`\`

## GROUP BY - группировка

\`\`\`sql
SELECT category, COUNT(*) as count
FROM products
GROUP BY category;
\`\`\`

## ORDER BY - сортировка

\`\`\`sql
SELECT * FROM users
ORDER BY age DESC;
\`\`\`

SQL — основа работы с базами данных!`,
        excerpt: 'Изучаем основы SQL: SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY и ORDER BY. Практические примеры запросов.',
        categoryId: sqlCategory.id,
        authorId: author2.id,
        published: true
      });
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article4.id, tags['sql'].id] }
      );
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article4.id, tags['bazy-dannyh'].id] }
      );
      console.log('✅ Статья "Основы SQL для начинающих" создана');
    }

    // Статья 5: Продвинутый SQL
    const article5Exists = await Article.findOne({ where: { slug: 'prodvinutyy-sql' } });
    if (!article5Exists) {
      const article5 = await Article.create({
        title: 'Продвинутый SQL: подзапросы и функции',
        slug: 'prodvinutyy-sql',
        content: `# Продвинутый SQL: подзапросы и функции

Изучаем продвинутые возможности SQL для эффективной работы с данными.

## Подзапросы (Subqueries)

\`\`\`sql
-- Подзапрос в WHERE
SELECT * FROM users
WHERE age > (SELECT AVG(age) FROM users);

-- Подзапрос в SELECT
SELECT name, 
       (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) as order_count
FROM users;
\`\`\`

## Агрегатные функции

\`\`\`sql
SELECT 
    COUNT(*) as total_users,
    AVG(age) as avg_age,
    MIN(age) as min_age,
    MAX(age) as max_age,
    SUM(age) as sum_age
FROM users;
\`\`\`

## Оконные функции (Window Functions)

\`\`\`sql
SELECT 
    name,
    age,
    ROW_NUMBER() OVER (ORDER BY age DESC) as rank
FROM users;
\`\`\`

## CTE (Common Table Expressions)

\`\`\`sql
WITH top_users AS (
    SELECT * FROM users
    WHERE age > 25
)
SELECT * FROM top_users;
\`\`\`

## Индексы

\`\`\`sql
-- Создание индекса
CREATE INDEX idx_email ON users(email);

-- Составной индекс
CREATE INDEX idx_name_age ON users(name, age);
\`\`\`

## Транзакции

\`\`\`sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
\`\`\`

Эти техники помогут писать эффективные SQL-запросы!`,
        excerpt: 'Изучаем продвинутый SQL: подзапросы, агрегатные функции, оконные функции, CTE, индексы и транзакции.',
        categoryId: sqlCategory.id,
        authorId: author2.id,
        published: true
      });
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article5.id, tags['sql'].id] }
      );
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article5.id, tags['bazy-dannyh'].id] }
      );
      console.log('✅ Статья "Продвинутый SQL" создана');
    }

    console.log('\n✅ Все авторы и статьи успешно добавлены!');
    console.log('\n📝 Созданные авторы:');
    console.log('   1. девнуржан - Python, MATLAB, Django');
    console.log('   2. асхатразраб - SQL и базы данных');
    console.log('\n📚 Созданные статьи:');
    console.log('   - Основы Python для начинающих');
    console.log('   - Работа с MATLAB: основы и примеры');
    console.log('   - Django: веб-фреймворк для Python');
    console.log('   - Основы SQL для начинающих');
    console.log('   - Продвинутый SQL: подзапросы и функции');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

// Запуск
addAuthors();

