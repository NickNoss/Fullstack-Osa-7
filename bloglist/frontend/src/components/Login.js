import { useState, useEffect } from 'react'
import { handleLogin } from '../slices/userSlice'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/userSlice'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const user = window.localStorage.getItem('user')
    if (user) {
      dispatch(setUser(JSON.parse(user)))
    } else {
      dispatch(setUser(null))
    }
  }, [dispatch])

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(handleLogin(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          id="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )
}

export default LoginForm
