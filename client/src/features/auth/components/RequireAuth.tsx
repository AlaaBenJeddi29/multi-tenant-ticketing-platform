import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve where they were headed so login can redirect back after success.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}