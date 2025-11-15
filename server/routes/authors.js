const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { auth, isAuthor } = require('../middleware/auth');
const { Article, User, Category, Tag, Comment, sequelize } = require('../models');

// Получить все статьи автора (включая неопубликованные) - только для авторов
router.get('/my-articles', auth, isAuthor, async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { authorId: req.user.id },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Добавляем количество комментариев к каждой статье
    const articlesWithStats = articles.map(article => {
      const articleData = article.toJSON();
      articleData.commentsCount = articleData.comments ? articleData.comments.length : 0;
      return articleData;
    });

    res.json(articlesWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить статистику автора - только для авторов
router.get('/my-stats', auth, isAuthor, async (req, res) => {
  try {
    const totalArticles = await Article.count({
      where: { authorId: req.user.id }
    });

    const publishedArticles = await Article.count({
      where: { 
        authorId: req.user.id,
        published: true
      }
    });

    const draftArticles = await Article.count({
      where: { 
        authorId: req.user.id,
        published: false
      }
    });

    const totalViews = await Article.sum('views', {
      where: { authorId: req.user.id }
    }) || 0;

    const totalComments = await Comment.count({
      include: [{
        model: Article,
        as: 'article',
        where: { authorId: req.user.id },
        required: true
      }]
    });

    // Популярные статьи (топ 5 по просмотрам)
    const popularArticles = await Article.findAll({
      where: { 
        authorId: req.user.id,
        published: true
      },
      order: [['views', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'slug', 'views', 'createdAt'],
      include: [
        { model: Category, as: 'category', attributes: ['name'] }
      ]
    });

    // Статистика по месяцам (последние 6 месяцев)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Article.findAll({
      where: {
        authorId: req.user.id,
        published: true,
        createdAt: {
          [Op.gte]: sixMonthsAgo
        }
      },
      attributes: [
        [sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('Article.id')), 'articlesCount'],
        [sequelize.fn('SUM', sequelize.col('views')), 'totalViews']
      ],
      group: [sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt'))],
      order: [[sequelize.fn('strftime', '%Y-%m', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json({
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews,
      totalComments,
      popularArticles,
      monthlyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить черновики автора - только для авторов
router.get('/my-drafts', auth, isAuthor, async (req, res) => {
  try {
    const drafts = await Article.findAll({
      where: { 
        authorId: req.user.id,
        published: false
      },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.json(drafts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

