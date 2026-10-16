import { Search, Bell, Moon, User, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // تحقق من حالة تسجيل الدخول عند تحميل الصفحة
    const session = api.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    // حدث الاشتراك لتحديث المستخدم عند تسجيل الدخول/الخروج
    const { data: listener } = api.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await api.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 px-4 sm:px-6 py-4 border-b border-gray-700 shadow-sm gap-3 sm:gap-0">
      {/* Search */}
      <div className="flex items-center bg-gray-700 px-3 py-2 rounded-lg w-full sm:w-80">
        <Search size={18} className="text-gray-300" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-sm text-white placeholder-gray-400"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-6 relative">
        {/* Dark Mode */}
        <button className="p-2 rounded-full hover:bg-gray-700 transition text-gray-300 hover:text-white">
          <Moon size={20} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-700 transition text-gray-300 hover:text-white">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            3
          </span>
        </button>

        {/* User/Profile */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-lg transition text-gray-300 hover:text-white"
            >
              <User size={20} />
              <span className="font-medium text-sm hidden sm:block">
                {user.email}
              </span>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <LogIn size={16} /> Login / Signup
          </button>
        )}
      </div>
    </div>
  );
}
