import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import "./home.css";

export default function Home({ searchTerm }) {
  const [products, setProducts] = useState([]);

  // 🔹 جلب المنتجات من Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (!error) setProducts(data);
    };
    fetchProducts();
  }, []);

  // 🔹 فلترة المنتجات بناءً على السيرش
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center">
        Our Products
      </Typography>

      {/* 🔹 Grid للمنتجات */}
      <div style={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && <p>No products found</p>}
      </div>

      {/* 🔹 قسم التواصل الاجتماعي كما كان */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 6,
          mb: 6,
          gap: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Contact Us
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <IconButton
            aria-label="Facebook"
            color="primary"
            href="https://facebook.com"
            target="_blank"
          >
            <FacebookIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            color="secondary"
            href="https://instagram.com"
            target="_blank"
          >
            <InstagramIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="LinkedIn"
            sx={{ color: "#0077b5" }}
            href="https://linkedin.com"
            target="_blank"
          >
            <LinkedInIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="WhatsApp"
            sx={{ color: "#25D366" }}
            href="https://wa.me/1234567890"
            target="_blank"
          >
            <WhatsAppIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
};
