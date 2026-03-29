// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// الحالة الابتدائية للمستخدم
const initialState = {
  user: null, // لو مفيش حد مسجل الدخول
  isAuthenticated: false, // هل المستخدم مسجل دخول
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // تسجيل الدخول
    login: (state, action) => {
      state.user = action.payload; // هنا بنخزن بيانات المستخدم
      state.isAuthenticated = true; // المستخدم بقى مسجل دخول
    },
    // تسجيل الخروج
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
