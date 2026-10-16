import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Package, Layers } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded-lg text-white"
      >
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 space-y-6 transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <h2 className="text-2xl font-bold">Admin Panel</h2>

        <nav className="space-y-2">
          <SidebarLink
            to="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <SidebarLink to="/users" icon={<Users size={18} />} label="Users" />
          <SidebarLink
            to="/products"
            icon={<Package size={18} />}
            label="Products"
          />
          <SidebarLink
            to="/catalog"
            icon={<Layers size={18} />}
            label="Catalog"
          />
          <SidebarLink
            to="/orders"
            icon={<Layers size={18} />}
            label="Orders"
          />
        </nav>
      </div>
    </>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition ${
          isActive ? "bg-blue-600" : "hover:bg-gray-800"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
