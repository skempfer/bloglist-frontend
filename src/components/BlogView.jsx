import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

const BlogView = ({ blogs, handleLike, handleDelete, currentUser }) => {
  const { id } = useParams()

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

  return (
    <section>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <p className="blog-url">{blog.url}</p>

      <div className="blog-likes-row">
        <span>likes {blog.likes}</span>
        <button className="button blog-like-button" onClick={() => handleLike(blog)}>
          like
        </button>
      </div>

      <p>added by {blog.user?.name || blog.user?.username || 'unknown'}</p>

      {isOwner && (
        <button className="button button-danger" onClick={() => handleDelete(blog)}>
          remove
        </button>
      )}
    </section>
  )
}

export default BlogView
