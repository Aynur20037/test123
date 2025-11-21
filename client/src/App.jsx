import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Article from './pages/Article'
import CreateArticle from './pages/CreateArticle'
import EditArticle from './pages/EditArticle'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminPanel from './pages/AdminPanel'
import AuthorDashboard from './pages/AuthorDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: '127.0.0.1' })
        });
        if (response.ok) {
          setServerDown(false);
        }
      } catch (error) {
        console.error('Server check failed:', error);
        setServerDown(true);
      }
    };
    checkServer();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {serverDown && (
            <div style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              ⚠️ Сервер недоступен. Приложение может работать некорректно.
            </div>
          )}
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/user/:id" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route
                path="/create-article"
                element={
                  <ProtectedRoute requiredRole="author">
                    <CreateArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-article/:id"
                element={
                  <ProtectedRoute requiredRole="author">
                    <EditArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/author-dashboard"
                element={
                  <ProtectedRoute requiredRole="author">
                    <AuthorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

