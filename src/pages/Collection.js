import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import "./Collection.css"; // علشان الأزرار القديمة زي crochet-btn

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  // الفئات زي القديمة
  const categories = [
    "all",
    "mobiles",
    "computers",
    "crochet",
    "home",
    "clothes",
    "furniture",
  ];

  // جلب البيانات من Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (!error) setProducts(data);
    };
    fetchProducts();
  }, []);

  // فلترة المنتجات
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" ||
      (selectedCategory === "computers" &&
        p.category.toLowerCase() === "laptops") || // إذا حبيت تحول لاب توب لـ computers
      p.category.toLowerCase() === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom align="center">
        Collection
      </Typography>

      {/* أزرار الكاتيجوري */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "contained" : "outlined"}
            color="primary"
            onClick={() => setSelectedCategory(cat)}
            sx={{
              textTransform: "capitalize",
              minWidth: cat === "crochet" ? 160 : 120,
            }}
            className={cat === "crochet" ? "crochet-btn" : ""}
          >
            {cat === "crochet" ? "Crochet by Hager" : cat}
          </Button>
        ))}
      </Box>

      {/* عرض المنتجات */}
      <Grid container spacing={3} justifyContent="center">
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
        {filteredProducts.length === 0 && (
          <Typography variant="body1" align="center">
            No products found
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
