import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'

const User = () => {
  const { id } = useParams()

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll
  })

  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <section>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </section>
  )
}

export default User
