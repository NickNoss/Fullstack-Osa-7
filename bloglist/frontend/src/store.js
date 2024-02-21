import { configureStore } from "@reduxjs/toolkit";
import rootSlice from "./slices/rootSlice";

const store = configureStore({
    reducer: rootSlice
});

export default store;