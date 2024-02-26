import { useEffect, useRef } from 'react'
import Blog from './components/Blog'

import LoginForm from './components/Login'
import NewBlog from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import storageService from './services/storage'

import { expireNotification } from './slices/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, deleteBlog, handleLike } from './slices/blogSlice'
import { handleLogout, initializeUser } from './slices/userSlice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
  }, [dispatch])
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()

  const user = useSelector((state) => state.login)

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

  if (!user || !user.token) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm />
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
          <button onClick={() => dispatch(handleLogout())}>logout</button>
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
