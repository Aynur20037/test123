import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import MarkdownEditor from '../components/MarkdownEditor'
import './CreateArticle.css'

const EditArticle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [published, setPublished] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [articleTags, setArticleTags] = useState([])

  useEffect(() => {
    fetchArticle()
    fetchCategories()
  }, [id])

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/id/${id}`)
      const article = response.data
      setTitle(article.title)
      setContent(article.content)
      setExcerpt(article.excerpt || '')
      setCategoryId(article.categoryId || '')
      setPublished(article.published)
      if (article.tags) {
        setArticleTags(article.tags)
        setTags(article.tags.map(t => t.name).join(', '))
      }
    } catch (error) {
      toast.error('Статья не найдена')
      navigate('/')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('excerpt', excerpt)
      formData.append('categoryId', categoryId)
      formData.append('tags', tags)
      formData.append('published', published)
      if (coverImage) {
        formData.append('coverImage', coverImage)
      }

      const response = await axios.put(`/api/articles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Статья обновлена')
      navigate(`/article/${response.data.slug}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка обновления статьи')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-article-page">
      <div className="container">
        <div className="create-article-container">
          <h1>Редактировать статью</h1>
          <form onSubmit={handleSubmit} className="article-form">
            <div className="form-group">
              <label>Заголовок *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Введите заголовок статьи"
              />
            </div>

            <div className="form-group">
              <label>Краткое описание</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Краткое описание статьи (будет показано в списке)"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Содержание *</label>
              <MarkdownEditor value={content} onChange={setContent} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Категория</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Теги (через запятую)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Обложка</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
              {coverImage && (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Preview"
                    style={{ maxWidth: '200px', marginTop: '10px' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Опубликовано
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditArticle

