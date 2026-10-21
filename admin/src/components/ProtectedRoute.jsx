import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await api.auth.getSession();
      if (!session || session.user.role !== "admin") {
        navigate("/login", { replace: true });
      } else {
        setLoading(false);
      }
    };

    checkSession();

    // Optional: listen to auth changes (logout in another tab)
    const { data: listener } = api.auth.onAuthStateChange(
      (_event, session) => {
        if (!session || session.user.role !== "admin") navigate("/login", { replace: true });
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) return <div className="text-[#50345f] p-8">Checking session...</div>;

  return children;
}
