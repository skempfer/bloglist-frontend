import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

const BlogView = ({
  blogs,
  handleLike,
  handleDelete,
  handleComment,
  currentUser
}) => {
  const { id } = useParams()
  const [comment, setComment] = useState('')

  const blog = useMemo(() => blogs.find((b) => b.id === id), [blogs, id])

  if (!blog) {
    return null
  }

  const blogOwner = blog.user
  const blogOwnerId =
    typeof blogOwner === 'object' ? blogOwner.id || blogOwner._id : blogOwner
  const currentUserId = currentUser?.id || currentUser?._id
  const isOwner =
    !!currentUser &&
    ((typeof blogOwner === 'object' &&
      blogOwner?.username === currentUser.username) ||
      (blogOwnerId && currentUserId && blogOwnerId === currentUserId))

  const submitComment = (event) => {
    event.preventDefault()
    const trimmedComment = comment.trim()
    if (!trimmedComment) {
      return
    }
    handleComment(blog.id, trimmedComment)
    setComment('')
  }

  return (
    <section className="blog-view">
      <h2 className="section-title">
        {blog.title} {blog.author}
      </h2>

      <p className="blog-url">{blog.url}</p>

      <div className="blog-likes-row">
        <span>likes {blog.likes}</span>
        <button className="button blog-like-button" onClick={() => handleLike(blog)}>
          like
        </button>
      </div>

      <p className="blog-owner-line">
        added by {blog.user?.name || blog.user?.username || 'unknown'}
      </p>

      {isOwner && (
        <button className="button button-danger" onClick={() => handleDelete(blog)}>
          remove
        </button>
      )}

      <h3 className="user-subtitle">comments</h3>

      <form onSubmit={submitComment} className="blog-comment-form">
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="write a comment"
        />
        <button className="button" type="submit">
          add comment
        </button>
      </form>

      <ul className="blog-comments-list">
        {(blog.comments || []).map((existingComment, index) => (
          <li key={`${blog.id}-comment-${index}`}>{existingComment}</li>
        ))}
      </ul>
    </section>
  )
}

export default BlogView
