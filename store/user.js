import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  accessToken: "",
  refreshToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getInfo(state, action) {
      if (action.payload.username !== undefined) {
        state.username = action.payload.username;
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearInfo(state) {
      state.username = "";
      state.email = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export default userSlice;
