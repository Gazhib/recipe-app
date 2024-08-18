import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user";

const store = configureStore({
  reducer: { user: userSlice.reducer },
});

export const userActions = userSlice.actions;

export default store;
