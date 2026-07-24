import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}