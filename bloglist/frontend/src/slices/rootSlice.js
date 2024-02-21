import { combineReducers } from "redux";
import blogSlice from "./blogSlice";
import notificationSlice from "./notificationSlice";

const rootSlice = combineReducers({
    blogs: blogSlice,
    notification: notificationSlice,
});

export default rootSlice;