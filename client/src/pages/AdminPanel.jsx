import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import './AdminPanel.css'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else {
      fetchCategories()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      toast.error('Ошибка загрузки категорий')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/users/${userId}/role`, { role: newRole })
      toast.success('Роль изменена')
      fetchUsers()
    } catch (error) {
      toast.error('Ошибка изменения роли')
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/categories', newCategory)
      toast.success('Категория создана')
      setNewCategory({ name: '', description: '' })
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка создания категории')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Удалить категорию?')) return
    try {
      await axios.delete(`/api/categories/${id}`)
      toast.success('Категория удалена')
      fetchCategories()
    } catch (error) {
      toast.error('Ошибка удаления категории')
    }
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Административная панель</h1>

        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'active' : ''}
          >
            Пользователи
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={activeTab === 'categories' ? 'active' : ''}
          >
            Категории
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>Управление пользователями</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Статей</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="reader">Читатель</option>
                        <option value="author">Автор</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </td>
                    <td>{user.articles?.length || 0}</td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="admin-section">
            <h2>Управление категориями</h2>
            <form onSubmit={handleCreateCategory} className="category-form">
              <div className="form-group">
                <label>Название категории</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Создать категорию
              </button>
            </form>

            <div className="categories-list">
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <div>
                    <h3>{category.name}</h3>
                    {category.description && <p>{category.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="btn btn-danger"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel

