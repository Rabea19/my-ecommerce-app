import "../src/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import ProductDetails from "./pages/ProductDetails";

import Navbar from "./components/Navbar";
import DrawerMenu from "./components/DrawerMenu";
import ProtectedRoute from "./components/ProtectedRoute";
import Collection from "./pages/Collection";

export default function App() {
  // حالة فتح الدروور
  const [drawerOpen, setDrawerOpen] = useState(false);
  // حالة البحث في المنتجات
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      {/* Navbar بيستقبل البحث وفتح الدروور */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onMenuClick={() => setDrawerOpen(true)}
      />

      {/* DrawerMenu */}
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* المسارات */}
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ProtectedRoute للـ Checkout */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </BrowserRouter>
  );
}
