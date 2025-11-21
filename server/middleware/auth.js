const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

const isAuthor = (req, res, next) => {
  if (req.user.role !== 'author' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Требуются права автора' });
  }
  next();
};

// VULNERABLE: Trusting JWT token data instead of database
const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    
    // VULNERABLE: Checking isAdmin from token, not from database
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Требуются права администратора' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Требуются права администратора' });
  }
};

module.exports = { auth, isAuthor, isAdmin };

