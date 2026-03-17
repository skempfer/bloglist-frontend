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

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('login failed')
    }
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
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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

    {blogs.map(blog => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
)
}

export default App