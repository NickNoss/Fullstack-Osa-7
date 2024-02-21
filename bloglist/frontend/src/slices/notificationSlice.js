import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: { message: null, isError: false, id: null},
    reducers: {
            setNotification(state, action) {
                return {
                    ...state,
                    message: action.payload.message,
                    isError: action.payload.isError,
                    id: action.payload.id
                }
            },
            removeNotification() {
                return {initialState: { message: null, isError: false, id: null}}
            },
            setNotificationTimeout(state, action) {
                state.id = action.payload;
            }
        }
})

export const { setNotification, removeNotification, setNotificationTimeout } = notificationSlice.actions;
export default notificationSlice.reducer;

export const expireNotification = (message, error) => {
    return dispatch => {
        dispatch(setNotification({ message: message, isError: error }))

        const timeId = setTimeout(() => dispatch(removeNotification()), 5000)
        dispatch(setNotificationTimeout(timeId))
    }
}