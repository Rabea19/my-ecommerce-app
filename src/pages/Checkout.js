import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./Checkout.css"; // استخدمنا ملف CSS لتنسيق الصفحة
import { supabase } from "../lib/supabase";
function Checkout() {
  // جلب المنتجات في الكارت من Redux
  const cartItems = useSelector((state) => state.cart.items);

  // جلب حالة تسجيل الدخول من Auth Slice
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // حساب السعر الكلي
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    const { error } = await supabase.from("orders").insert([
      {
        products: cartItems,
        total_price: totalPrice,
        status: "pending",
      },
    ]);

    if (error) {
      alert("Error placing order");
      console.log(error);
    } else {
      alert("Order placed successfully!");
    }
  };

  // لو المستخدم مش مسجل دخول، نوجهه لصفحة SignIn
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          <ul className="checkout-list">
            {cartItems.map((item) => (
              <li key={item.id} className="checkout-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="checkout-image"
                />
                <div className="checkout-info">
                  <span className="checkout-title">{item.title}</span>
                  <span className="checkout-quantity">
                    {item.quantity} x ${item.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="checkout-total">Total: ${totalPrice}</h2>

          <button className="checkout-button" onClick={handleCheckout}>
            Confirm Purchase
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
