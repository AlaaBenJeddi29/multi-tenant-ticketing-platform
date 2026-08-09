import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while checking session
  if (isLoading) {
    return null; // Or replace with a loading spinner component
  }

  if (!isAuthenticated) {
    // Preserve where they were headed so login can redirect back after success.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}