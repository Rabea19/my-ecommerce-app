import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../lib/api";
import { login } from "../store/authSlice";
export default function SignIn() {
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { data, error } = await api.auth[
      register ? "signUp" : "signInWithPassword"
    ]({ email: form.get("email"), password: form.get("password") });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    dispatch(login(data.user));
    navigate(location.state?.from?.pathname || "/profile", { replace: true });
  }
  return (
    <main className="wrap max-w-lg py-14">
      <div className="panel">
        <p className="eyebrow mb-4">Your personal corner</p>
        <h1 className="font-display text-4xl">
          {register ? "Join the collection." : "Lovely to see you."}
        </h1>
        <p className="mb-7 mt-4 text-sm text-ink/60">
          {register
            ? "Create an account to place and follow your orders."
            : "Sign in to continue your shopping journey."}
        </p>
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm">
            Email address
            <input
              className="field mt-2"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              className="field mt-2"
              name="password"
              type="password"
              autoComplete={register ? "new-password" : "current-password"}
              required
              minLength={10}
              maxLength={128}
            />
          </label>
          {register && (
            <p className="text-xs text-ink/60">Use 10–128 characters.</p>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button disabled={busy} className="btn w-full">
            {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
          </button>
        </form>
        <button
          disabled={busy}
          className="mt-6 w-full text-sm text-plum underline"
          onClick={() => {
            setRegister(!register);
            setError("");
          }}
        >
          {register
            ? "Already registered? Sign in"
            : "New here? Create an account"}
        </button>
      </div>
    </main>
  );
}
