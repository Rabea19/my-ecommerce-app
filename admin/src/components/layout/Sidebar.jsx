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
      <a href="/admin/" className="flex items-center gap-3 text-[#50345f] mb-10" aria-label="Simple Market administration">
        <span className="flex items-center justify-center shrink-0 w-11 h-11 rounded-full border border-[#50345f] font-serif italic text-3xl">m.</span>
        <span className="font-serif text-xl tracking-tight">simple market<span className="block font-sans text-[9px] tracking-[.22em] mt-1">THE STORE STUDIO</span></span>
      </a>
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
      <div className="mt-auto pt-12"><a href="/" className="flex items-center gap-2 text-sm text-[#50345f]">Visit storefront <ArrowUpRight size={16}/></a></div>
    </div>
  );
}
