import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Modal } from "../AdminUI";
export default function MainLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:flex">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <aside className="hidden lg:block w-60 shrink-0 bg-white border-r border-[#e9e3eb] p-6 sticky top-0 h-screen">
        <Sidebar />
      </aside>
      <div className="min-w-0 flex-1">
        <Navbar onMenu={() => setOpen(true)} />
        <main
          id="main-content"
          className="max-w-[1700px] mx-auto p-4 sm:p-7 xl:p-8"
        >
          <Outlet />
        </main>
        <footer className="px-7 py-5 muted text-xs">
          Simple Market · Administration
        </footer>
      </div>
      {open && (
        <Modal title="Workspace" onClose={() => setOpen(false)}>
          <Sidebar onNavigate={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
