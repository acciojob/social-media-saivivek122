import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import usersReducer from "./usersSlice";
import notificationsReducer from "./notificationsSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
});
