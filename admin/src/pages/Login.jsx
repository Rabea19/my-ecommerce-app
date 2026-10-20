import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
export default function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const { error } = await api.auth.signInWithPassword({
      admin: true,
      email,
      password,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else navigate("/");
  }
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:flex bg-[#50345f] text-white p-16 flex-col justify-between">
        <a href="/" className="font-serif text-4xl">
          market.
        </a>
        <div>
          <p className="text-xs uppercase tracking-[.25em] mb-5 text-[#dac9e3]">
            The store studio
          </p>
          <h1 className="font-serif text-6xl leading-tight">
            Good things.
            <br />
            Beautifully managed.
          </h1>
          <p className="mt-6 text-[#dac9e3]">
            Your collection, your customers, your everyday.
          </p>
        </div>
        <p className="text-sm text-[#dac9e3]">
          A thoughtful space for your store.
        </p>
      </section>
      <section className="flex items-center justify-center p-5 sm:p-12">
        <div className="w-full max-w-sm">
          <a className="font-serif text-3xl text-[#50345f]" href="/">
            market.
          </a>
          <h2 className="page-title mt-10">Admin Login</h2>
          <p className="muted mt-3 mb-8">
            Welcome back. Let's look after your store.
          </p>
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm">
              Email
              <input
                className="field mt-2"
                type="email"
                autoComplete="username"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                className="field mt-2"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="btn w-full" disabled={busy}>
              {busy ? "Signing in…" : "Login"}
            </button>
          </form>
          <a href="/" className="block text-sm mt-7 text-[#746c79]">
            ← Back to storefront
          </a>
        </div>
      </section>
    </main>
  );
}
