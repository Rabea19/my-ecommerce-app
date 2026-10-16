import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    toast.dismiss(); // إزالة أي توست مفتوح سابقًا

    const { data, error } = await api.auth.signInWithPassword({
      admin: true,
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setEmail("");
      setPassword("");

      // 🟢 إظهار التوست مباشرة
      toast.success("Logged in successfully!", {
        duration: 2000,
      });

      // 🟢 الانتقال مباشرة للصفحة الرئيسية
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl flex flex-col gap-4 w-full max-w-sm"
      >
        <h2 className="text-xl font-bold text-white text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => { window.location.href = "/signin"; }}
          className="text-gray-300 hover:text-white underline mt-2"
        >
          Customer Sign Up
        </button>
      </form>
    </div>
  );
}
