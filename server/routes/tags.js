const express = require('express');
const router = express.Router();
const { Tag, Article } = require('../models');
const slugify = require('slugify');

// Получить все теги
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{
        model: Article,
        as: 'articles',
        where: { published: true },
        required: false,
        attributes: ['id']
      }],
      order: [['name', 'ASC']]
    });

    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить тег по slug
router.get('/:slug', async (req, res) => {
  try {
    const tag = await Tag.findOne({
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

    if (!tag) {
      return res.status(404).json({ message: 'Тег не найден' });
    }

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

