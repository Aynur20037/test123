import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import './Auth.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/auth/forgot-password', { email })
      setSent(true)
      toast.success('Письмо отправлено! Проверьте вашу почту.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка отправки письма')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h1>Письмо отправлено</h1>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            Если аккаунт с таким email существует, мы отправили письмо с инструкциями 
            по восстановлению пароля.
          </p>
          <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            Проверьте папку "Спам", если письмо не пришло.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>
            Вернуться к входу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Восстановление пароля</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Введите ваш email, и мы отправим инструкции по восстановлению пароля
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
        <p className="auth-link">
          <Link to="/login">Вернуться к входу</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword

