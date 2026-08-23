import { Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useEffect } from "react";

export default function RootLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role) {
      document.documentElement.setAttribute("data-role", user.role);
    }
  }, [user?.role]);

  return (
    <main className="min-h-screen bg-slate-100">
      <Outlet />
    </main>
  );
}