import { createSlice } from "@reduxjs/toolkit"
import loginService from "../services/login"
import { expireNotification } from "./notificationSlice"
import storageService from "../services/storage"

const initialState = {
  token: null,
  username: null,
  name: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export default userSlice.reducer
export const { setUser } = userSlice.actions

export const initializeUser = () => {
  return (dispatch) => {
    const storedUser = storageService.loadUser()
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }
}

export const handleLogin = (username, password) => {
  return async (dispatch, useState) => {
  try {
    const user = await loginService.login({
      username,
      password,
    })
    dispatch(setUser(user))
    dispatch(expireNotification(`Logged in as ${username}`, false))
    storageService.saveUser(user)
  } catch (ex) {
    console.log("log in error")
    dispatch(expireNotification(ex.response.data.error, true))
  }
  }
}

export const handleLogout = () => {
  return (dispatch) => {
    dispatch(setUser(initialState))
    storageService.removeUser()
  }
}