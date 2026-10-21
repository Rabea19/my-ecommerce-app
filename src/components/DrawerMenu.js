import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../lib/api";
import Icon from "./Icon";
export default function DrawerMenu({ open, onClose }) {
  const dialog = useRef(null);
  const [error, setError] = useState("");
  const user = useSelector((s) => s.auth.user);
  useEffect(() => {
    const node = dialog.current;
    if (open) {
      node.showModal();
    } else if (node.open) node.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClose={onClose}
      className="m-0 min-h-screen w-80 max-w-[90vw] bg-cream p-7 backdrop:bg-ink/40"
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl">Explore market</h2>
        <button onClick={onClose} aria-label="Close menu" className="p-2">
          <Icon name="close" />
        </button>
      </div>
      <nav aria-label="Account navigation" className="flex flex-col gap-5">
        {[
          ["Home", "/"],
          ["All collections", "/collection"],
          ["Shopping bag", "/cart"],
          ["My orders", "/orders"],
          ["My account", "/profile"],
          ["Contact us", "/contact"],
        ].map(([label, path]) => (
          <Link key={path} to={path} onClick={onClose}>
            {label}
          </Link>
        ))}
        {user?.role === "admin" && <a href="/admin/">Dashboard</a>}
        {user ? (
          <button
            className="btn-outline"
            onClick={async () => {
              const { error } = await api.auth.signOut();
              if (error) setError(error.message);
              else onClose();
            }}
          >
            Sign out
          </button>
        ) : (
          <Link to="/signin" onClick={onClose} className="btn">
            Sign in / Create account
          </Link>
        )}
      </nav>
      {error && (
        <p role="alert" className="mt-5 text-red-700">
          {error}
        </p>
      )}
    </dialog>
  );
}
