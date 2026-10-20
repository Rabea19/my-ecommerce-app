import { useState, useEffect } from "react";
import { Menu, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import toast from "react-hot-toast";
export default function Navbar({ onMenu }) {
  const [user, setUser] = useState(null),
    [q, setQ] = useState(""),
    [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    api.auth.getSession().then(({ data }) => setUser(data.session?.user));
  }, []);
  async function logout() {
    setBusy(true);
    const { error } = await api.auth.signOut();
    setBusy(false);
    if (error) toast.error(error.message);
    else navigate("/login");
  }
  return (
    <header className="border-b border-[#e9e3eb] bg-white px-4 sm:px-7 py-4 flex flex-wrap items-center gap-3">
      <button
        className="btn-soft lg:hidden"
        aria-label="Open navigation"
        onClick={onMenu}
      >
        <Menu size={20} />
      </button>
      <form
        className="flex-1 min-w-0 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/products?q=" + encodeURIComponent(q));
        }}
      >
        <Search size={18} className="text-[#9779a3] shrink-0" />
        <input
          aria-label="Search products"
          placeholder="Search products…"
          className="field border-0 bg-[#faf9fb] max-w-md"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
      <div className="hidden sm:block text-right max-w-48">
        <p className="text-sm font-semibold truncate">
          {user?.name || "Store administrator"}
        </p>
        <p className="muted text-xs truncate">{user?.email}</p>
      </div>
      <button
        className="btn-soft"
        aria-label="Sign out"
        disabled={busy}
        onClick={logout}
      >
        <LogOut size={18} />
      </button>
    </header>
  );
}
