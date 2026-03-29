import { Link } from 'react-router-dom'
import './Blog.css'

const Blog = ({ blog }) => {
  return (
    <article className="blog blog-item">
      <div className="blog-summary">
        <div>
          <h3 className="blog-title">
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </h3>
          <p className="blog-author">by {blog.author}</p>
        </div>
      </div>
    </article>
  )
}

export default Blog
