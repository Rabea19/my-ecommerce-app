import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
const links = [
  ["/", "Overview", LayoutDashboard],
  ["/orders", "Orders", ShoppingBag],
  ["/products", "Products", Package],
  ["/catalog", "Catalog", Layers],
  ["/users", "Customers", Users],
];
export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <a
        href="/admin/"
        className="text-3xl font-serif tracking-tight text-[#50345f] mb-2"
      >
        market<span className="text-[#a286ad]">.</span>
      </a>
      <p className="text-[10px] uppercase tracking-[.24em] muted mb-10">
        The store studio
      </p>
      <p className="muted text-xs uppercase tracking-widest mb-4">Workspace</p>
      <nav aria-label="Admin navigation" className="space-y-2">
        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            end={to === "/"}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-[#50345f] text-white" : "text-[#746c79] hover:bg-[#f0eaf3]"}`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-12">
        <div className="rounded-2xl bg-[#f4eef6] p-4">
          <p className="font-serif text-lg">Your store, beautifully managed.</p>
          <a
            href="/"
            className="mt-4 flex items-center gap-2 text-sm text-[#50345f]"
          >
            Visit storefront <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
