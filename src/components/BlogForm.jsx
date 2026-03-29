import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    await createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <h2 className="section-title">create new</h2>

      <label className="field">
        <span>title</span>
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </label>

      <label className="field">
        <span>author</span>
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </label>

      <label className="field">
        <span>url</span>
        <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </label>

      <button className="button" type="submit">
        create
      </button>
    </form>
  )
}

export default BlogForm
