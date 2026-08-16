import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  BarChart3,
  ScrollText,
  Activity,
  Settings,
} from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  group: string;
}

export default function AdminLayout() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const navItems: NavItem[] = [
    {
      to: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      group: "PLATFORM",
    },
    {
      to: "/admin/organizations",
      icon: Building2,
      label: "Organizations",
      group: "MANAGEMENT",
    },
    {
      to: "/admin/users",
      icon: Users,
      label: "Users",
      group: "MANAGEMENT",
    },
    {
      to: "/admin/analytics",
      icon: BarChart3,
      label: "Analytics",
      group: "INSIGHTS",
    },
    {
      to: "/admin/activity",
      icon: ScrollText,
      label: "Activity Logs",
      group: "INSIGHTS",
    },
    {
      to: "/admin/system-health",
      icon: Activity,
      label: "System Health",
      group: "INFRASTRUCTURE",
    },
    {
      to: "/admin/settings",
      icon: Settings,
      label: "Settings",
      group: "CONFIGURATION",
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            Platform Console
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {(["PLATFORM", "MANAGEMENT", "INSIGHTS", "INFRASTRUCTURE", "CONFIGURATION"] as const).map((group) => {
            const groupItems = navItems.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group} className="mb-4">
                <p className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/60">
                  {group}
                </p>
                <ul className="space-y-1">
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "text-sidebar-foreground"
                            )
                          }
                        >
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 px-2">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <Separator className="mb-3" />

          <div className="mb-2 px-2">
            <p className="mb-2 text-xs font-semibold text-sidebar-foreground/60">
              ACCOUNT
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="size-4" />
            <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
