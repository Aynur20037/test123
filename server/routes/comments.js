const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const { Comment, Article, User } = require('../models');

// Получить комментарии к статье
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { 
        articleId: req.params.articleId,
        parentId: null
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
        {
          model: Comment,
          as: 'replies',
          include: [
            { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать комментарий
router.post('/', auth, [
  body('content').isLength({ min: 1, max: 1000 }),
  body('articleId').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, articleId, parentId } = req.body;

    // Проверка существования статьи
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    const comment = await Comment.create({
      content,
      articleId,
      userId: req.user.id,
      parentId: parentId || null
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
      ]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить комментарий
router.put('/:id', auth, [
  body('content').isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }

    // Проверка прав
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }

    comment.content = req.body.content;
    await comment.save();

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
      ]
    });

    res.json(commentWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить комментарий
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }

    // Проверка прав
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на удаление' });
    }

    await comment.destroy();
    res.json({ message: 'Комментарий удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

