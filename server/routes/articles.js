const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { body, validationResult, query } = require('express-validator');
const { auth, isAuthor } = require('../middleware/auth');
const { Article, User, Category, Tag, Comment } = require('../models');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'article-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Получить все статьи (с фильтрацией и поиском)
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isString(),
  query('category').optional().isInt(),
  query('tag').optional().isString(),
  query('author').optional().isInt()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = { published: true };

    // Поиск
    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { content: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    // Фильтр по категории
    if (req.query.category) {
      where.categoryId = req.query.category;
    }

    // Фильтр по автору
    if (req.query.author) {
      where.authorId = req.query.author;
    }

    const { count, rows } = await Article.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] }
      ]
    });

    // Фильтр по тегу
    let articles = rows;
    if (req.query.tag) {
      articles = articles.filter(article => 
        article.tags.some(tag => tag.slug === req.query.tag)
      );
    }

    res.json({
      articles,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить статью по ID (для редактирования)
router.get('/id/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'bio'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] }
      ]
    });

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Проверка прав
    if (article.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на просмотр' });
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить статью по slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'bio'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] },
        { 
          model: Comment, 
          as: 'comments',
          include: [
            { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
          ],
          where: { parentId: null },
          required: false
        }
      ]
    });

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Увеличить просмотры
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать статью (только для авторов)
router.post('/', auth, isAuthor, upload.single('coverImage'), [
  body('title').isLength({ min: 3, max: 200 }),
  body('content').notEmpty(),
  body('excerpt').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, categoryId, tags, published } = req.body;

    const article = await Article.create({
      title,
      content,
      excerpt,
      coverImage: req.file ? `/uploads/${req.file.filename}` : null,
      categoryId: categoryId || null,
      authorId: req.user.id,
      published: published === 'true' || published === true
    });

    // Добавить теги
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
      const tagInstances = await Promise.all(
        tagArray.map(async (tagName) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName },
            defaults: { slug: tagName.toLowerCase().replace(/\s+/g, '-') }
          });
          return tag;
        })
      );
      await article.setTags(tagInstances);
    }

    const articleWithRelations = await Article.findByPk(article.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.status(201).json(articleWithRelations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить статью
router.put('/:id', auth, upload.single('coverImage'), [
  body('title').optional().isLength({ min: 3, max: 200 }),
  body('content').optional().notEmpty()
], async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Проверка прав (автор или админ)
    if (article.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }

    const { title, content, excerpt, categoryId, tags, published } = req.body;

    if (title) article.title = title;
    if (content) article.content = content;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (categoryId !== undefined) article.categoryId = categoryId;
    if (published !== undefined) article.published = published === 'true' || published === true;
    if (req.file) article.coverImage = `/uploads/${req.file.filename}`;

    await article.save();

    // Обновить теги
    if (tags !== undefined) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
      const tagInstances = await Promise.all(
        tagArray.map(async (tagName) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName },
            defaults: { slug: tagName.toLowerCase().replace(/\s+/g, '-') }
          });
          return tag;
        })
      );
      await article.setTags(tagInstances);
    }

    const articleWithRelations = await Article.findByPk(article.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.json(articleWithRelations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить статью
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    // Проверка прав (автор или админ)
    if (article.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await article.destroy();
    res.json({ message: 'Статья удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

