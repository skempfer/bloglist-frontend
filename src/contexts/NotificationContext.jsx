import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)

export const useShowNotification = () => {
  const [, dispatch] = useContext(NotificationContext)

  return (message, type = 'error', duration = 5) => {
    dispatch({ type: 'SET', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'CLEAR' }), duration * 1000)
  }
}
