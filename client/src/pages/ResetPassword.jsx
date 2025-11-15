import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Auth.css'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(true)

  useEffect(() => {
    // Можно добавить проверку токена при загрузке
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)

    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password })
      toast.success('Пароль успешно изменен!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка сброса пароля')
      if (error.response?.status === 400) {
        setValidToken(false)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!validToken) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h1>Токен недействителен</h1>
          <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
            Ссылка для сброса пароля недействительна или истек срок её действия.
          </p>
          <Link to="/forgot-password" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>
            Запросить новую ссылку
          </Link>
          <p className="auth-link">
            <Link to="/login">Вернуться к входу</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Сброс пароля</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Введите новый пароль для вашего аккаунта
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Новый пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Минимум 6 символов"
            />
          </div>
          <div className="form-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Повторите пароль"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Изменение...' : 'Изменить пароль'}
          </button>
        </form>
        <p className="auth-link">
          <Link to="/login">Вернуться к входу</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword

