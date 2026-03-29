import { createSlice } from "@reduxjs/toolkit";

/*
  1️⃣ بنحاول نجيب الكارت من Local Storage
  لو مش موجود → نخليه Array فاضي
*/
const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

/*
  2️⃣ الحالة الابتدائية للكارت
*/
const initialState = {
  items: savedCart,
};

/*
  3️⃣ إنشاء Slice الكارت
*/
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /*
      ➕ إضافة منتج للكارت
    */
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      // تحديث Local Storage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    /*
      ⬆️ زيادة الكمية
    */
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    /*
      ⬇️ تقليل الكمية
    */
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);

      if (item) {
        item.quantity -= 1;

        // لو الكمية وصلت صفر → نشيله
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    /*
      🗑️ مسح الكارت كله
    */
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

/*
  4️⃣ تصدير الأكشنز
*/
export const { addToCart, increaseQuantity, decreaseQuantity, clearCart } =
  cartSlice.actions;

/*
  5️⃣ تصدير الريديـوسر
*/
export default cartSlice.reducer;
