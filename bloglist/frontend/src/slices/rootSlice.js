import { combineReducers } from "redux";
import blogSlice from "./blogSlice";
import notificationSlice from "./notificationSlice";
import userSlice from "./userSlice";

const rootSlice = combineReducers({
    blogs: blogSlice,
    notification: notificationSlice,
    login: userSlice
});

export default rootSlice;