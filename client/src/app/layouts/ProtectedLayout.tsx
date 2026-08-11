import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/common/AppSidebar";

export default function ProtectedLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}