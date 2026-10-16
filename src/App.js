import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import { api } from "./lib/api";
import "../src/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    api.auth.getSession().then(({data}) => { if (active) { dispatch(data.session ? login(data.session.user) : logout()); setReady(true); } });
    const {data:listener} = api.auth.onAuthStateChange((_event, session) => dispatch(session ? login(session.user) : logout()));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [dispatch]);
  // حالة فتح الدروور
  const [drawerOpen, setDrawerOpen] = useState(false);
  // حالة البحث في المنتجات
  const [searchTerm, setSearchTerm] = useState("");

  if (!ready) return <p>Loading...</p>;
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
