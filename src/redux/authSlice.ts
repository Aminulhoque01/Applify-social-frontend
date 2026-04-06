// src/redux/features/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token"); // 🔥 remove token
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;