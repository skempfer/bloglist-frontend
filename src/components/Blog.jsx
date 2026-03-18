import { useState } from 'react'
import './Blog.css'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  return (
    <article className="blog blog-item">
      <div className="blog-summary">
        <div>
          <h3 className="blog-title">{blog.title}</h3>
          <p className="blog-author">by {blog.author}</p>
        </div>

        <button className="button button-secondary blog-toggle" onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <p className="blog-url">{blog.url}</p>
          <div className="blog-likes-row">
            <span>likes {blog.likes}</span>
            <button className="button blog-like-button">like</button>
          </div>
        </div>
      )}
    </article>
  )
}

export default Blog