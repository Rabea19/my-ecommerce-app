import { useParams } from "react-router-dom";
import products from "../data/products";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  if (!product) return <h2>Product not found</h2>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* الصورة */}
        <div style={styles.imageBox}>
          <img src={product.image} alt={product.title} style={styles.image} />
        </div>

        {/* التفاصيل */}
        <div
          style={{
            ...styles.details,
            ...(show ? styles.detailsShow : {}),
          }}
        >
          <h1>{product.title}</h1>
          <p style={styles.price}>{product.price} EGP</p>
          <p style={styles.desc}>
            This is a premium product with high quality materials and excellent
            performance. Perfect for everyday use.
          </p>
        </div>
      </div>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "80%",
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    display: "flex",
    gap: "40px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },

  imageBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    maxWidth: "350px",
    objectFit: "contain",
    animation: "float 5s ease-in-out infinite",
  },

  details: {
    flex: 1,
    opacity: 0,
    transform: "translateY(30px)",
    transition: "1s ease",
  },

  detailsShow: {
    opacity: 1,
    transform: "translateY(0)",
  },

  price: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2e7d32",
    margin: "20px 0",
  },

  desc: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#444",
  },
};
