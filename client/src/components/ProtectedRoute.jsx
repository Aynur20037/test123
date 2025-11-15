import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    if (requiredRole === 'author' && user.role !== 'author' && user.role !== 'admin') {
      return <Navigate to="/" replace />
    }
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute

