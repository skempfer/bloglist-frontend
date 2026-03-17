import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
  } catch (error) {
    console.error('login failed')
  }
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  setUser(null)
}

const loginForm = () => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

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
    <div>
      <h2>log in</h2>
      {loginForm()}
    </div>
  )
}

return (
  <div>
    <p>{user.name} logged in</p>
    <button onClick={handleLogout}>logout</button>
    {blogs.map(blog => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
)
}

export default App