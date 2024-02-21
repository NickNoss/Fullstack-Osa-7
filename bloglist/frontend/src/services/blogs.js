import axios from 'axios'
import storageService from '../services/storage'
const baseUrl = '/api/blogs'

const headers = {
  Authorization: storageService.loadUser()
    ? `Bearer ${storageService.loadUser().token}`
    : null,
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (object) => {
  const request = await axios.post(baseUrl, object, { headers })
  return request.data
}

const update = async (object) => {
  const request = await axios.put(`${baseUrl}/${object.id}`, object, {
    headers,
  })
  return request.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, { headers })
  return response.status
}

const putLike = async (id, blogToLike) => {
  const likedBlog = {
    ...blogToLike,
    likes: blogToLike.likes + 1,
  }

  const response = await axios.put(`${baseUrl}/${id}`, likedBlog, { headers })
  return response.data
}

const blogService = { getAll, create, update, remove, putLike }

export default blogService
