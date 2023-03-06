import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./registerUserSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
