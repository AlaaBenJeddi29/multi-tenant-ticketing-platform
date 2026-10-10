import { useAuth } from "@/features/auth/context/AuthContext";
import AdminLayout from "@/features/admin/components/AdminLayout";

import ProtectedLayout from "./ProtectedLayout";

// /settings is shared by every role, so pick the chrome that matches the user:
// the platform console for super admins, the standard app sidebar for tenants.
export default function SettingsLayout() {
  const { user } = useAuth();

  if (user?.role === "SUPER_ADMIN") {
    return <AdminLayout />;
  }

  return <ProtectedLayout />;
}
