import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const [cardHover, setCardHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnClick, setBtnClick] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAdd = () => {
    setBtnClick(true);
    dispatch(addToCart(product));
    setShowToast(true);

    setTimeout(() => {
      setBtnClick(false);
    }, 200);

    setTimeout(() => {
      setShowToast(false);
    }, 1800);
  };

  return (
    <>
      {/* 👇 نحط الـ keyframes هنا */}
      <style>
        {`
  @keyframes toastInOut {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }
    10% {
      transform: translateY(0);
      opacity: 1;
    }
    80% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-10px);
      opacity: 0; /* 👈 fade out سلس */
    }
  }
`}
      </style>
      <div
        style={{
          ...styles.card,
          ...(cardHover ? styles.cardHover : {}),
        }}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
      >
        {/* 👇 اللينك موجود زي ما اتفقنا */}
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <div style={styles.imageWrapper}>
            <img src={product.image} alt={product.title} style={styles.image} />
          </div>
        </Link>

        <h3 style={styles.title}>{product.title}</h3>
        <p style={styles.price}>{product.price} EGP</p>

        {/* 👇 أنيميشن الزرار فقط */}
        <button
          onClick={handleAdd}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            ...styles.button,
            ...(btnHover ? styles.buttonHover : {}),
            ...(btnClick ? styles.buttonClick : {}),
          }}
        >
          Add to Cart
        </button>
        {showToast && (
          <div style={{ ...styles.toast, ...styles.toastAnimate }}>
            ✅ Added to cart
          </div>
        )}
      </div>
    </>
  );
}
const styles = {
  card: {
    borderRadius: "16px",
    padding: "16px",
    width: "230px",
    backgroundColor: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    position: "relative", // 👈 مهم جدًا
  },

  cardHover: {
    transform: "translateY(-10px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
  },

  imageWrapper: {
    height: "180px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  title: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "10px 0",
    color: "#000",
  },

  price: {
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: "12px",
  },

  button: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.25s ease",
    marginTop: "auto",
  },

  buttonHover: {
    transform: "scale(1.06)",
    boxShadow: "0 8px 20px rgba(25,118,210,0.4)",
  },

  buttonClick: {
    transform: "scale(0.92)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  toast: {
    position: "absolute",
    bottom: "15px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#2e7d32",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    zIndex: 10,
  },
  toastAnimate: {
    animation: "toastInOut 5s ease forwards",
  },
};
