import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar />

        <main className="flex-1 p-6 bg-gray-800">
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}
