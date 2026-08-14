import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "@/app/router/routes";
import type { UserRole } from "../types/auth.types";

type Props = {
  roles: UserRole[];
};

export default function RequireRole({ roles }: Props) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
}
