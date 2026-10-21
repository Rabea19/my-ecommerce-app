import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Products = lazy(() => import("./pages/Products"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));

function Loading() {
  return <div className="text-[#50345f] p-8">Loading...</div>;
}

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="catalog"
              element={
                <ProtectedRoute>
                  <Catalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>

      {/* 🟢 Toaster ثابت أعلى كل العناصر */}
      <Toaster
        position="bottom-center"
        containerStyle={{ zIndex: 9999 }}
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#50345f",
            color: "#fff",
            textAlign: "center",
          },
        }}
      />
    </BrowserRouter>
  );
}
