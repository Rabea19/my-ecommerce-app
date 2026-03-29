import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice"; // استوردنا Auth Slice
const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer, // ضفناه هنا
  },
});

export default store;
