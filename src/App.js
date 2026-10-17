import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import { api } from "./lib/api";
import Footer from "./components/Footer";
import Orders from "./pages/Orders";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    api.auth.getSession().then(({ data }) => {
      if (active) {
        dispatch(data.session ? login(data.session.user) : logout());
        setReady(true);
      }
    });
    const { data: listener } = api.auth.onAuthStateChange((_event, session) =>
      dispatch(session ? login(session.user) : logout()),
    );
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);
  // حالة فتح الدروور
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!ready)
    return (
      <p role="status" className="wrap py-20 text-center text-plum">
        Opening Simple Market…
      </p>
    );
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar onMenuClick={() => setDrawerOpen(true)} />

      {/* DrawerMenu */}
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* المسارات */}
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="wrap py-20">
              <h1 className="heading">Page not found</h1>
              <a className="btn mt-6" href="/">
                Back to home
              </a>
            </div>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
