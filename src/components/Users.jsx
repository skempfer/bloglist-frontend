import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const Users = () => {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll
  })

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              <strong>blogs created</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
