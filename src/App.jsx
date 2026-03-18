import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/FormLogin'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()

  const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username,
      password
    })

    window.localStorage.setItem(
      'loggedBlogappUser',
      JSON.stringify(user)
    )

    blogService.setToken(user.token)

    setUser(user)
    setUsername('')
    setPassword('')
  } catch {
    setErrorMessage('wrong username or password')

    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  setUser(null)
}

const addBlog = async (blogObject) => {
  try {
    const newBlog = await blogService.create(blogObject)
    blogFormRef.current.toggleVisibility()

    setBlogs(prev => prev.concat(newBlog))

    setMessage(`a new blog ${newBlog.title} added`)
    setTimeout(() => setMessage(null), 5000)
  } catch {
    setErrorMessage('failed to create blog')
  }
}

  useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token)
  }
}, [])

 if (user === null) {
  return (
    <div className="app-shell">
      <div className="app-card">
        <h1 className="app-title">Bloglist</h1>
        <h2 className="section-title">log in</h2>
        <Notification message={errorMessage} type="error" />

        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    </div>
  )
}

return (
  <div className="app-shell">
    <div className="app-card">
      <header className="app-header">
        <h1 className="app-title">Bloglist</h1>
        <div className="user-row">
          <p className="user-label">{user.name} logged in</p>
          <button className="button button-secondary" onClick={handleLogout}>logout</button>
        </div>
      </header>

      <Notification message={message} type="success" />

      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <section className="blogs-section">
        <h2 className="section-title">blogs</h2>
        <div className="blog-list">
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  </div>
)
}

export default App