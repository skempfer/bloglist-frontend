import { createElement } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { NotificationProvider } from './contexts/NotificationContext'
import { UserProvider } from './contexts/UserContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  createElement(
    QueryClientProvider,
    { client: queryClient },
    createElement(
      NotificationProvider,
      null,
      createElement(UserProvider, null, createElement(App))
    )
  )
)
