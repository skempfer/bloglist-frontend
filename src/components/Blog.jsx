const Blog = ({ blog }) => (
  <div className="blog-item">
    <h3 className="blog-title">{blog.title}</h3>
    <p className="blog-author">by {blog.author}</p>
  </div>  
)

export default Blog