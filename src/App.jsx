import { useState, useEffect, useRef, useMemo } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/FormLogin'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import './App.css'

const getUserIdFromToken = (token) => {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decodedPayload.id || null
  } catch {
    return null
  }
}

const App = () => {
  const importedComponents = [Blog, Notification, LoginForm, BlogForm, Togglable]
  void importedComponents

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
    const loggedUser = await loginService.login({
      username,
      password
    })

    const normalizedUser = {
      ...loggedUser,
      id: loggedUser.id || getUserIdFromToken(loggedUser.token)
    }

    window.localStorage.setItem(
      'loggedBlogappUser',
      JSON.stringify(normalizedUser)
    )

    blogService.setToken(normalizedUser.token)

    setUser(normalizedUser)
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

const handleLike = async (blog) => {
  try {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    returnedBlog.user = blog.user

    setBlogs(prev =>
      prev.map(b => (b.id === blog.id ? returnedBlog : b))
    )
  } catch (error) {
    console.error('Error updating likes:', error)
  }
}

const addBlog = async (blogObject) => {
  try {
    const newBlog = await blogService.create(blogObject)
    blogFormRef.current.toggleVisibility()

    const normalizedBlog = {
      ...newBlog,
      // Backend can return only user id on create; keep full user for UI ownership checks.
      user: newBlog.user && typeof newBlog.user === 'object' ? newBlog.user : user
    }

    setBlogs(prev => prev.concat(normalizedBlog))

    setMessage(`a new blog ${newBlog.title} added`)
    setTimeout(() => setMessage(null), 5000)
  } catch {
    setErrorMessage('failed to create blog')
  }
}

const handleDelete = async (blog) => {
  const confirmDelete = window.confirm(
    `Remove blog ${blog.title} by ${blog.author}?`
  )

  if (!confirmDelete) return

  try {
    await blogService.remove(blog.id, user.token)

    setBlogs(prev => prev.filter(b => b.id !== blog.id))
  } catch {
    console.error('failed to delete blog')
  }
}

const sortedBlogs = useMemo(() => {
  return [...blogs].sort((a, b) => b.likes - a.likes)
}, [blogs])

useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

  if (loggedUserJSON) {
    const parsedUser = JSON.parse(loggedUserJSON)
    const normalizedUser = {
      ...parsedUser,
      id: parsedUser.id || getUserIdFromToken(parsedUser.token)
    }

    setUser(normalizedUser)
    blogService.setToken(normalizedUser.token)
  }
}, [])

useEffect(() => {
  if (!user) {
    setBlogs([])
    return
  }

  const fetchBlogs = async () => {
    try {
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
    } catch {
      // If backend is unavailable, force a new login instead of leaving a broken state.
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      setUser(null)
      setErrorMessage('backend indisponivel, faca login novamente')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  fetchBlogs()
}, [user])

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
          {sortedBlogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              currentUser={user}
              handleLike={handleLike}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </section>
    </div>
  </div>
)
}

export default App