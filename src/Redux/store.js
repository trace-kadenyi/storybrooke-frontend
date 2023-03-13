import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerUserSlice";
import loginReducer from "./loginUserSlice";

export default configureStore({
  reducer: {
    user: registerReducer,
    user: loginReducer,
  },
});
