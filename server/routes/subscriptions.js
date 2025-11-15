const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { User } = require('../models');

// Подписаться на автора
router.post('/:authorId', auth, async (req, res) => {
  try {
    const author = await User.findByPk(req.params.authorId);

    if (!author) {
      return res.status(404).json({ message: 'Автор не найден' });
    }

    if (author.id === req.user.id) {
      return res.status(400).json({ message: 'Нельзя подписаться на самого себя' });
    }

    // Проверка существующей подписки
    const subscriber = await req.user.getSubscriptions({
      where: { id: author.id }
    });

    if (subscriber.length > 0) {
      return res.status(400).json({ message: 'Вы уже подписаны на этого автора' });
    }

    await req.user.addSubscription(author);
    res.json({ message: 'Подписка оформлена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отписаться от автора
router.delete('/:authorId', auth, async (req, res) => {
  try {
    const author = await User.findByPk(req.params.authorId);

    if (!author) {
      return res.status(404).json({ message: 'Автор не найден' });
    }

    await req.user.removeSubscription(author);
    res.json({ message: 'Подписка отменена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить подписки пользователя
router.get('/my', auth, async (req, res) => {
  try {
    const subscriptions = await req.user.getSubscriptions({
      attributes: ['id', 'username', 'avatar', 'bio'],
      include: [{
        model: require('../models').Article,
        as: 'articles',
        where: { published: true },
        required: false,
        attributes: ['id'],
        limit: 3,
        order: [['createdAt', 'DESC']]
      }]
    });

    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Проверить подписку
router.get('/:authorId/check', auth, async (req, res) => {
  try {
    const author = await User.findByPk(req.params.authorId);

    if (!author) {
      return res.status(404).json({ message: 'Автор не найден' });
    }

    const subscriptions = await req.user.getSubscriptions({
      where: { id: author.id }
    });

    res.json({ subscribed: subscriptions.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

