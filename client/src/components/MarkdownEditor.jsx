import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './MarkdownEditor.css'

const MarkdownEditor = ({ value, onChange }) => {
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className="markdown-editor">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={!isPreview ? 'active' : ''}
        >
          Редактор
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={isPreview ? 'active' : ''}
        >
          Предпросмотр
        </button>
      </div>
      {isPreview ? (
        <div className="editor-preview">
          <div className="markdown-content">
            {value ? (
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <em>Начните вводить текст...</em>
            )}
          </div>
        </div>
      ) : (
        <textarea
          className="editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Начните писать статью в формате Markdown..."
          rows="20"
        />
      )}
      <div className="editor-help">
        <small>
          Поддерживается Markdown. Используйте **жирный**, *курсив*, `код`, # заголовки
        </small>
      </div>
    </div>
  )
}

export default MarkdownEditor

