import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import Icon from "./Icon";
import AnnouncementBar from "./AnnouncementBar";
export default function Navbar({ onMenuClick }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.items);
  const authenticated = useSelector((s) => s.auth.isAuthenticated);
  return (
    <>
      <AnnouncementBar />
      <header className="border-b border-plum/10 bg-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-5 py-5">
          <div className="flex items-center gap-3">
            <button
              className="p-2 md:hidden"
              aria-label="Open menu"
              onClick={onMenuClick}
            >
              <Icon name="menu" />
            </button>
            <Link
              to="/"
              aria-label="Simple Market home"
              className="flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-plum/30 font-display text-2xl italic text-plum">
                m.
              </span>
              <span className="font-display text-2xl tracking-tight">
                simple market
                <span className="mt-1 block font-sans text-[9px] uppercase tracking-[0.3em] text-plum">
                  The everyday collection
                </span>
              </span>
            </Link>
          </div>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/collection?q=${encodeURIComponent(query)}`);
            }}
            className="order-last flex w-full items-center rounded-full bg-cream px-4 md:order-none md:w-96"
          >
            <input
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find something you'll love"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
            />
            <button aria-label="Submit search" className="p-2">
              <Icon name="search" />
            </button>
          </form>
          <div className="flex gap-4">
            <Link
              to={authenticated ? "/profile" : "/signin"}
              className="flex items-center gap-2 text-sm"
            >
              <Icon name="user" />
              <span className="hidden lg:inline">
                {authenticated ? "My account" : "Sign in"}
              </span>
            </Link>
            <Link
              to="/cart"
              aria-label={`Shopping bag, ${items.reduce((n, i) => n + i.quantity, 0)} items`}
              className="flex items-center gap-2"
            >
              <Icon name="bag" />
              <span className="rounded-full bg-lilac px-2 py-1 text-xs text-plum">
                {items.reduce((n, i) => n + i.quantity, 0)}
              </span>
            </Link>
            <button
              aria-label="Account menu"
              onClick={onMenuClick}
              className="hidden p-2 md:block"
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
        <nav
          aria-label="Main navigation"
          className="wrap flex gap-7 overflow-x-auto whitespace-nowrap pb-4 text-sm"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-bold text-plum" : "text-ink/70"
            }
          >
            Home
          </NavLink>
          {[
            ["All collections", ""],
            ["Mobiles", "mobiles"],
            ["Computers", "computers"],
            ["For your home", "home"],
            ["Clothing", "clothes"],
            ["Furniture", "furniture"],
            ["Crochet by Hager", "crochet"],
          ].map(([label, key]) => (
            <Link
              className="hover:text-plum"
              key={label}
              to={`/collection${key ? "?category=" + key : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
