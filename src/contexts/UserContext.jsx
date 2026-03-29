import { createContext, useContext, useEffect, useReducer } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const UserContext = createContext()

const getUserIdFromToken = (token) => {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    )
    return decodedPayload.id || null
  } catch {
    return null
  }
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const normalizedUser = {
        ...parsedUser,
        id: parsedUser.id || getUserIdFromToken(parsedUser.token)
      }
      blogService.setToken(normalizedUser.token)
      dispatch({ type: 'SET', payload: normalizedUser })
    }
  }, [])

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export const useUserActions = () => {
  const [, dispatch] = useContext(UserContext)

  const login = async (credentials) => {
    const loggedUser = await loginService.login(credentials)
    const normalizedUser = {
      ...loggedUser,
      id: loggedUser.id || getUserIdFromToken(loggedUser.token)
    }
    window.localStorage.setItem(
      'loggedBlogappUser',
      JSON.stringify(normalizedUser)
    )
    blogService.setToken(normalizedUser.token)
    dispatch({ type: 'SET', payload: normalizedUser })
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    dispatch({ type: 'CLEAR' })
  }

  return { login, logout }
}
