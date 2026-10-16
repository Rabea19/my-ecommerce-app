import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import "./Checkout.css"; // استخدمنا ملف CSS لتنسيق الصفحة
import { request } from "../lib/api";
import { clearCart } from "../store/cartSlice";
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

  const dispatch = useDispatch();
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const handleCheckout = async () => {
    if (lock.current || !cartItems.length) return;
    lock.current = true; setBusy(true);
    const fingerprint = JSON.stringify(cartItems.map(({id, quantity}) => ({id, quantity})));
    let attempt; try { attempt = JSON.parse(sessionStorage.getItem("checkoutAttempt")); } catch {}
    if (!attempt || attempt.fingerprint !== fingerprint) {
      attempt = {fingerprint, key:crypto.randomUUID()};
      sessionStorage.setItem("checkoutAttempt", JSON.stringify(attempt));
    }
    try {
      await request("/orders", {method:"POST", headers:{"Idempotency-Key":attempt.key}, body:JSON.stringify({products:cartItems.map(({id,quantity})=>({id,quantity}))})});
      dispatch(clearCart()); sessionStorage.removeItem("checkoutAttempt"); alert("Order placed successfully!");
    } catch (error) { alert(error.message); }
    finally { lock.current = false; setBusy(false); }
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

          <button disabled={busy} className="checkout-button" onClick={handleCheckout}>
            Confirm Purchase
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
