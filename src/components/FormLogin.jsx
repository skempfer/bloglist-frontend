const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword
}) => {
  return (
    <form className="login-form" onSubmit={handleLogin}>
      <label className="field">
        <span>username</span>
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>

      <label className="field">
        <span>password</span>
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>

      <button className="button" type="submit">
        login
      </button>
    </form>
  )
}

export default LoginForm
