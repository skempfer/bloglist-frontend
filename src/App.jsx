import { useState, useRef, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, NavLink } from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/FormLogin'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import {
  useNotification,
  useShowNotification
} from './contexts/NotificationContext'
import { useUser, useUserActions } from './contexts/UserContext'
import './App.css'

const App = () => {
  const queryClient = useQueryClient()
  const [notification] = useNotification()
  const showNotification = useShowNotification()
  const [user] = useUser()
  const { login, logout } = useUserActions()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user
  })

  const sortedBlogs = useMemo(
    () => [...blogs].sort((a, b) => b.likes - a.likes),
    [blogs]
  )

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      blogFormRef.current.toggleVisibility()
      showNotification(`a new blog ${newBlog.title} added`, 'success')
    },
    onError: () => showNotification('failed to create blog', 'error')
  })

  const likeMutation = useMutation({
    mutationFn: (blog) => {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user
      }
      return blogService.update(blog.id, updatedBlog)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  })

  const deleteMutation = useMutation({
    mutationFn: (blog) => blogService.remove(blog.id, user.token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] })
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
    onError: () => showNotification('failed to add comment', 'error')
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login({ username, password })
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLike = (blog) => likeMutation.mutate(blog)

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteMutation.mutate(blog)
    }
  }

  const addBlog = (blogObject) => createBlogMutation.mutate(blogObject)

  const handleComment = (id, comment) => {
    commentMutation.mutate({ id, comment })
  }

  if (user === null) {
    return (
      <div className="app-shell">
        <div className="app-card">
          <h1 className="app-title">Bloglist</h1>
          <h2 className="section-title">log in</h2>
          <Notification
            message={notification?.message}
            type={notification?.type}
          />
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
          <nav className="app-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `app-nav-link ${isActive ? 'active' : ''}`.trim()
              }
            >
              blogs
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `app-nav-link ${isActive ? 'active' : ''}`.trim()
              }
            >
              users
            </NavLink>
          </nav>
          <div className="user-row">
            <p className="user-label">{user.name} logged in</p>
            <button className="button button-secondary" onClick={logout}>
              logout
            </button>
          </div>
        </header>

        <Notification
          message={notification?.message}
          type={notification?.type}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Togglable buttonLabel="create new" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
                <section className="blogs-section">
                  <h2 className="section-title">blogs</h2>
                  <div className="blog-list">
                    {sortedBlogs.map((blog) => (
                      <Blog key={blog.id} blog={blog} />
                    ))}
                  </div>
                </section>
              </>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={blogs}
                handleLike={handleLike}
                handleDelete={handleDelete}
                handleComment={handleComment}
                currentUser={user}
              />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
