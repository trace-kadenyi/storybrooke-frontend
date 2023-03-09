import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const LOGIN_URL = "http://localhost:4000/login";

export const loginUser = createAsyncThunk("user/loginUser", async (user) => {
  const response = await axios.post(LOGIN_URL, user);
  return response.data;
});

const initialState = {
  user: {},
  status: null,
};

const loginUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = "success";
      state.user = action.payload;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default loginUserSlice.reducer;
