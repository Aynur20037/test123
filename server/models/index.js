const sequelize = require('../config/database');
const User = require('./User');
const Article = require('./Article');
const Comment = require('./Comment');
const Category = require('./Category');
const Tag = require('./Tag');

// Определение связей
User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Article.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Article, { foreignKey: 'categoryId', as: 'articles' });

Article.belongsToMany(Tag, { through: 'ArticleTags', as: 'tags' });
Tag.belongsToMany(Article, { through: 'ArticleTags', as: 'articles' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Article.hasMany(Comment, { foreignKey: 'articleId', as: 'comments' });
Comment.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

// Подписки (многие ко многим)
User.belongsToMany(User, { 
  through: 'Subscriptions', 
  as: 'subscribers', 
  foreignKey: 'authorId',
  otherKey: 'subscriberId'
});
User.belongsToMany(User, { 
  through: 'Subscriptions', 
  as: 'subscriptions', 
  foreignKey: 'subscriberId',
  otherKey: 'authorId'
});

module.exports = {
  sequelize,
  User,
  Article,
  Comment,
  Category,
  Tag
};

