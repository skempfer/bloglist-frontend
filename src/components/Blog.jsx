import { useState } from 'react'
import './Blog.css'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const blogOwner = blog.user
  const blogOwnerId =
    typeof blogOwner === 'object' ? (blogOwner.id || blogOwner._id) : blogOwner
  const currentUserId = currentUser?.id || currentUser?._id
  const isOwner =
    !!currentUser &&
    ((typeof blogOwner === 'object' && blogOwner?.username === currentUser.username) ||
      (blogOwnerId && currentUserId && blogOwnerId === currentUserId))

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
            <button className="button blog-like-button" onClick={() => handleLike(blog)}>like</button>
          </div>
          {isOwner && (
            <button className="button button-danger blog-delete-button" onClick={() => handleDelete(blog)}>
              delete
            </button>
          )}
        </div>
      )}
    </article>
  )
}

export default Blog