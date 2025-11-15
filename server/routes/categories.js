const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, isAdmin } = require('../middleware/auth');
const { Category, Article } = require('../models');
const slugify = require('slugify');

// Получить все категории
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Article,
        as: 'articles',
        where: { published: true },
        required: false,
        attributes: ['id']
      }],
      order: [['name', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить категорию по slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
      include: [{
        model: Article,
        as: 'articles',
        where: { published: true },
        required: false,
        include: [
          { model: require('../models').User, as: 'author', attributes: ['id', 'username', 'avatar'] }
        ]
      }]
    });

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать категорию (только админ)
router.post('/', auth, isAdmin, [
  body('name').isLength({ min: 2, max: 50 }),
  body('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const category = await Category.create({
      name,
      slug,
      description
    });

    res.status(201).json(category);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Категория с таким именем уже существует' });
    }
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить категорию (только админ)
router.put('/:id', auth, isAdmin, [
  body('name').optional().isLength({ min: 2, max: 50 }),
  body('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    if (req.body.name) {
      category.name = req.body.name;
      category.slug = slugify(req.body.name, { lower: true, strict: true });
    }
    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить категорию (только админ)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    await category.destroy();
    res.json({ message: 'Категория удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

