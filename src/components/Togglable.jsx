import { useState } from 'react'

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="togglable">
      <div style={hideWhenVisible}>
        <button className="button" onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      </div>

      <div className="togglable-content" style={showWhenVisible}>
        {children}
        <button className="button button-secondary" onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable