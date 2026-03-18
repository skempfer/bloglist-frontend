const Notification = ({ message, type = 'error' }) => {
  if (!message) return null

  return <div className={`notification ${type}`}>{message}</div>
}

export default Notification