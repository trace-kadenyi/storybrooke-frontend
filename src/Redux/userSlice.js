import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const REGISTER_USER = "http://localhost:4000/register";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (user) => {
    const response = await axios.post(REGISTER_USER, user);
    return response.data;
  }
);

const initialState = {
  user: {},
  status: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [registerUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [registerUser.fulfilled]: (state, action) => {
      state.status = "success";
      state.user = action.payload;
    },
    [registerUser.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

export default userSlice.reducer;
