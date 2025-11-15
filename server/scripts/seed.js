const { User, Article, Category, Tag, sequelize } = require('../models');

async function seed() {
  try {
    console.log('🌱 Начало заполнения базы данных...');

    // Создаем автора, если его нет
    let author = await User.findOne({ where: { email: 'author@devblog.com' } });
    if (!author) {
      author = await User.create({
        username: 'DevAuthor',
        email: 'author@devblog.com',
        password: 'password123',
        role: 'author',
        bio: 'Опытный разработчик, пишу о программировании'
      });
      console.log('✅ Автор создан');
    }

    // Создаем категорию "JavaScript", если её нет
    let category = await Category.findOne({ where: { slug: 'javascript' } });
    if (!category) {
      category = await Category.create({
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Статьи о JavaScript и программировании'
      });
      console.log('✅ Категория создана');
    }

    // Создаем теги
    const tagsData = [
      { name: 'Переменные', slug: 'peremennye' },
      { name: 'Массивы', slug: 'massivy' },
      { name: 'Циклы', slug: 'cikly' },
      { name: 'Основы', slug: 'osnovy' }
    ];

    const tags = [];
    for (const tagData of tagsData) {
      let tag = await Tag.findOne({ where: { slug: tagData.slug } });
      if (!tag) {
        tag = await Tag.create(tagData);
      }
      tags.push(tag);
    }
    console.log('✅ Теги созданы');

    // Статья 1: Переменные
    const article1Exists = await Article.findOne({ where: { slug: 'peremennye-v-javascript' } });
    if (!article1Exists) {
      const article1 = await Article.create({
        title: 'Переменные в JavaScript',
        slug: 'peremennye-v-javascript',
        content: `# Переменные в JavaScript

Переменные — это основа любого языка программирования. В JavaScript есть несколько способов объявления переменных.

## var, let и const

### var
\`\`\`javascript
var name = "Иван";
var age = 25;
\`\`\`

### let
\`\`\`javascript
let name = "Иван";
let age = 25;
\`\`\`

### const
\`\`\`javascript
const PI = 3.14159;
const name = "Иван";
\`\`\`

## Различия

- **var** — устаревший способ, имеет функциональную область видимости
- **let** — блочная область видимости, можно изменять
- **const** — блочная область видимости, нельзя изменять (константа)

## Рекомендации

- Используйте \`const\` по умолчанию
- Используйте \`let\`, если значение будет изменяться
- Избегайте \`var\` в современном коде

## Примеры

\`\`\`javascript
// Хорошо
const userName = "Иван";
let userAge = 25;
userAge = 26; // OK

// Плохо
var userName = "Иван"; // устаревший синтаксис
\`\`\``,
        excerpt: 'Изучаем основы работы с переменными в JavaScript: var, let и const. Узнайте различия и когда что использовать.',
        categoryId: category.id,
        authorId: author.id,
        published: true
      });
      // Добавляем теги через прямой SQL
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article1.id, tags[0].id] }
      );
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article1.id, tags[3].id] }
      );
      console.log('✅ Статья "Переменные в JavaScript" создана');
    }

    // Статья 2: Массивы
    const article2Exists = await Article.findOne({ where: { slug: 'rabota-s-massivami-v-javascript' } });
    if (!article2Exists) {
      const article2 = await Article.create({
        title: 'Работа с массивами в JavaScript',
        slug: 'rabota-s-massivami-v-javascript',
        content: `# Работа с массивами в JavaScript

Массивы — это структуры данных, которые позволяют хранить коллекции элементов.

## Создание массива

\`\`\`javascript
// Литерал массива
const fruits = ['яблоко', 'банан', 'апельсин'];

// Конструктор
const numbers = new Array(1, 2, 3);
\`\`\`

## Основные методы

### push() и pop()
\`\`\`javascript
const arr = [1, 2, 3];
arr.push(4); // [1, 2, 3, 4]
arr.pop();   // [1, 2, 3]
\`\`\`

### shift() и unshift()
\`\`\`javascript
const arr = [1, 2, 3];
arr.unshift(0); // [0, 1, 2, 3]
arr.shift();    // [1, 2, 3]
\`\`\`

### map()
\`\`\`javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
// [2, 4, 6]
\`\`\`

### filter()
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(n => n % 2 === 0);
// [2, 4]
\`\`\`

### reduce()
\`\`\`javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 10
\`\`\`

## Полезные методы

- \`find()\` — найти первый элемент
- \`some()\` — проверить, есть ли хотя бы один
- \`every()\` — проверить, все ли элементы соответствуют условию
- \`includes()\` — проверить наличие элемента`,
        excerpt: 'Изучаем работу с массивами в JavaScript: создание, основные методы (map, filter, reduce) и полезные функции.',
        categoryId: category.id,
        authorId: author.id,
        published: true
      });
      // Добавляем теги через прямой SQL
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article2.id, tags[1].id] }
      );
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article2.id, tags[3].id] }
      );
      console.log('✅ Статья "Работа с массивами в JavaScript" создана');
    }

    // Статья 3: Циклы
    const article3Exists = await Article.findOne({ where: { slug: 'cikly-v-javascript' } });
    if (!article3Exists) {
      const article3 = await Article.create({
        title: 'Циклы в JavaScript',
        slug: 'cikly-v-javascript',
        content: `# Циклы в JavaScript

Циклы позволяют выполнять код многократно. В JavaScript есть несколько типов циклов.

## for

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// 0, 1, 2, 3, 4
\`\`\`

## for...of

Итерация по элементам массива:

\`\`\`javascript
const fruits = ['яблоко', 'банан', 'апельсин'];
for (const fruit of fruits) {
  console.log(fruit);
}
\`\`\`

## for...in

Итерация по свойствам объекта:

\`\`\`javascript
const person = { name: 'Иван', age: 25 };
for (const key in person) {
  console.log(key, person[key]);
}
\`\`\`

## while

\`\`\`javascript
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}
\`\`\`

## do...while

\`\`\`javascript
let i = 0;
do {
  console.log(i);
  i++;
} while (i < 5);
\`\`\`

## forEach()

Метод массивов для итерации:

\`\`\`javascript
const numbers = [1, 2, 3];
numbers.forEach((num, index) => {
  console.log(index, num);
});
\`\`\`

## Управление циклами

### break
Прерывает выполнение цикла:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);
}
\`\`\`

### continue
Пропускает текущую итерацию:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i); // только нечетные
}
\`\`\`

## Рекомендации

- Используйте \`for...of\` для массивов
- Используйте \`forEach()\` для функционального стиля
- Избегайте \`for...in\` для массивов`,
        excerpt: 'Изучаем все типы циклов в JavaScript: for, while, for...of, for...in и методы массивов. Узнайте, когда что использовать.',
        categoryId: category.id,
        authorId: author.id,
        published: true
      });
      // Добавляем теги через прямой SQL
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article3.id, tags[2].id] }
      );
      await sequelize.query(
        `INSERT OR IGNORE INTO ArticleTags (ArticleId, TagId, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
        { replacements: [article3.id, tags[3].id] }
      );
      console.log('✅ Статья "Циклы в JavaScript" создана');
    }

    console.log('✅ База данных успешно заполнена!');
    console.log('\n📝 Созданные статьи:');
    console.log('   1. Переменные в JavaScript');
    console.log('   2. Работа с массивами в JavaScript');
    console.log('   3. Циклы в JavaScript');
    console.log('\n👤 Автор: DevAuthor (author@devblog.com, пароль: password123)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

// Запуск
seed();

