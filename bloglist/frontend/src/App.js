import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/Login'
import NewBlog from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { expireNotification } from './slices/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, deleteBlog, handleLike } from './slices/blogSlice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
  const blogs = useSelector((state) => state.blogs)
  const [user, setUser] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    const user = storageService.loadUser()
    setUser(user)
  }, [])


  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      storageService.saveUser(user)
      dispatch(expireNotification(`Welcome ${user.name}`, false))
    } catch (e) {
      dispatch(expireNotification('wrong username or password', true))
    }
  }

  const logout = async () => {
    setUser(null)
    storageService.removeUser()
    dispatch(expireNotification('Logged out', false))
  }

  const like = async (id) => {
    dispatch(handleLike(id))
    dispatch(expireNotification('You liked a blog', false))
  }

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`,
    )
    if (ok) {
      dispatch(deleteBlog(blog.id))
      dispatch(expireNotification(`You removed ${blog.title} by ${blog.author}`, false))
    }
  }

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user && (
        <div>
          {user.name} logged in
          <button onClick={logout}>logout</button>
        </div>
      )}
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlog />
      </Togglable>
      <div>
        {[...blogs].sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog.id)}
            canRemove={
              user && blog.user && blog.user.username === user.username
            }
            remove={() => remove(blog)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
