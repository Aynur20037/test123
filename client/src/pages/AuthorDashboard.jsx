import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiFileText, FiEye, FiMessageCircle, FiTrendingUp, FiEdit2, FiCalendar } from 'react-icons/fi'
import './AuthorDashboard.css'

const AuthorDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [articles, setArticles] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && (user.role === 'author' || user.role === 'admin')) {
      fetchStats()
      fetchArticles()
    }
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/authors/my-stats')
      setStats(response.data)
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/authors/my-articles')
      setArticles(response.data)
    } catch (error) {
      console.error('Ошибка загрузки статей:', error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user || (user.role !== 'author' && user.role !== 'admin')) {
    return (
      <div className="author-dashboard">
        <div className="container">
          <div className="access-denied">
            <h2>Доступ ограничен</h2>
            <p>Эта страница доступна только для авторов.</p>
            <p>Чтобы стать автором, выберите роль "Автор" при регистрации.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="author-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Панель автора</h1>
          <Link to="/create-article" className="btn btn-primary">
            <FiEdit2 /> Создать новую статью
          </Link>
        </div>

        <div className="dashboard-tabs">
          <button
            onClick={() => setActiveTab('stats')}
            className={activeTab === 'stats' ? 'active' : ''}
          >
            Статистика
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={activeTab === 'articles' ? 'active' : ''}
          >
            Мои статьи ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={activeTab === 'drafts' ? 'active' : ''}
          >
            Черновики ({stats?.draftArticles || 0})
          </button>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FiFileText />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalArticles}</h3>
                  <p>Всего статей</p>
                </div>
              </div>

              <div className="stat-card published">
                <div className="stat-icon">
                  <FiTrendingUp />
                </div>
                <div className="stat-info">
                  <h3>{stats.publishedArticles}</h3>
                  <p>Опубликовано</p>
                </div>
              </div>

              <div className="stat-card views">
                <div className="stat-icon">
                  <FiEye />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalViews.toLocaleString()}</h3>
                  <p>Всего просмотров</p>
                </div>
              </div>

              <div className="stat-card comments">
                <div className="stat-icon">
                  <FiMessageCircle />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalComments}</h3>
                  <p>Комментариев</p>
                </div>
              </div>
            </div>

            {stats.popularArticles && stats.popularArticles.length > 0 && (
              <div className="popular-articles">
                <h2>Популярные статьи</h2>
                <div className="articles-list">
                  {stats.popularArticles.map((article) => (
                    <div key={article.id} className="popular-article-item">
                      <Link to={`/article/${article.slug}`}>
                        <h3>{article.title}</h3>
                      </Link>
                      <div className="article-meta">
                        <span><FiEye /> {article.views} просмотров</span>
                        <span><FiCalendar /> {formatDate(article.createdAt)}</span>
                        {article.category && (
                          <span className="category">{article.category.name}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="dashboard-content">
            <div className="articles-table">
              <table>
                <thead>
                  <tr>
                    <th>Заголовок</th>
                    <th>Статус</th>
                    <th>Просмотры</th>
                    <th>Комментарии</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <Link to={`/article/${article.slug}`}>
                          {article.title}
                        </Link>
                      </td>
                      <td>
                        <span className={`status ${article.published ? 'published' : 'draft'}`}>
                          {article.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </td>
                      <td>{article.views || 0}</td>
                      <td>{article.commentsCount || 0}</td>
                      <td>{formatDate(article.createdAt)}</td>
                      <td>
                        <Link
                          to={`/edit-article/${article.id}`}
                          className="btn-edit-small"
                        >
                          <FiEdit2 /> Редактировать
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="dashboard-content">
            <div className="drafts-list">
              {articles
                .filter(article => !article.published)
                .map((article) => (
                  <div key={article.id} className="draft-card">
                    <div className="draft-content">
                      <h3>
                        <Link to={`/edit-article/${article.id}`}>
                          {article.title || 'Без названия'}
                        </Link>
                      </h3>
                      {article.excerpt && (
                        <p className="draft-excerpt">{article.excerpt}</p>
                      )}
                      <div className="draft-meta">
                        <span>Обновлено: {formatDate(article.updatedAt)}</span>
                        {article.category && (
                          <span className="category">{article.category.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="draft-actions">
                      <Link
                        to={`/edit-article/${article.id}`}
                        className="btn btn-primary"
                      >
                        <FiEdit2 /> Продолжить редактирование
                      </Link>
                    </div>
                  </div>
                ))}
              {articles.filter(article => !article.published).length === 0 && (
                <div className="no-drafts">
                  <p>У вас пока нет черновиков</p>
                  <Link to="/create-article" className="btn btn-primary">
                    Создать статью
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthorDashboard

