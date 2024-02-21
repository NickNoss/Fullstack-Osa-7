import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"
import { expireNotification } from "./notificationSlice"

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        appendBlog(state, action) {
            state.push(action.payload)
        },
        removeBlog(state, action) {
            return state.filter(blog => blog.id !== action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        },
    }
})

export const { appendBlog, setBlogs, removeBlog } = blogSlice.actions
export default blogSlice.reducer

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (newBlog) => {
    return async dispatch => {
        try {
            const createdBlog = await blogService.create(newBlog)
            dispatch(expireNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, false))
            dispatch(appendBlog(createdBlog))
        } catch (e) {
            dispatch(expireNotification('Error adding blog', true))
        }
    }
}

export const deleteBlog = (id) => {
    return async (dispatch) => {
      try {
        const status = await blogService.deleteBlog(id)
        if (status !== 204) {
          dispatch(expireNotification("Unauthorized", true))
          return
        }
        
        dispatch(expireNotification("Blog successfully deleted", false))
        dispatch(removeBlog(id))
      } catch (error) {
        dispatch(expireNotification("Error deleting blog", true))
      }
    }
  }