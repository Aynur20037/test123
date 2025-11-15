const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { User, Article } = require('../models');

// Получить всех пользователей (только админ)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{
        model: Article,
        as: 'articles',
        attributes: ['id']
      }]
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'email'] },
      include: [{
        model: Article,
        as: 'articles',
        where: { published: true },
        required: false,
        include: [
          { model: require('../models').Category, as: 'category' },
          { model: require('../models').Tag, as: 'tags' }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить профиль
router.put('/:id', auth, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав на редактирование' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { username, bio, avatar } = req.body;

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Изменить роль пользователя (только админ)
router.patch('/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { role } = req.body;
    if (!['reader', 'author', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Неверная роль' });
    }

    user.role = role;
    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

