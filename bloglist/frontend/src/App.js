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
import {initializeBlogs, setBlogs } from './slices/blogSlice'

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

  const like = async (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const updatedBlog = await blogService.update(blogToUpdate)
    dispatch(expireNotification(`You liked ${blog.title} by ${blog.author}`, false))
    setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
  }

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`,
    )
    if (ok) {
      await blogService.remove(blog.id)
      dispatch(expireNotification(`You removed ${blog.title} by ${blog.author}`, false))
      setBlogs(blogs.filter((b) => b.id !== blog.id))
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
            like={() => like(blog)}
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
