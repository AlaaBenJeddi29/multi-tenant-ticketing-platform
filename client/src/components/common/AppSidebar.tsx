import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  AlertCircle,
  Package,
  Users,
  Ticket,
  Clock,
  Zap,
  UserCog,
  // Placeholder imports for future links:
  // Bell,
  LogOut,
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
  allowedRoles?: Array<"SUPER_ADMIN" | "ORG_ADMIN" | "AGENT">;
}

export function AppSidebar() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  // Navigation items - all authenticated users can view these pages
  const navItems: NavItem[] = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      to: "/categories",
      icon: Layers,
      label: "Categories",
    },
    {
      to: "/priorities",
      icon: AlertCircle,
      label: "Priorities",
    },
    {
      to: "/assets",
      icon: Package,
      label: "Assets",
    },
    {
      to: "/requesters",
      icon: Users,
      label: "Requesters",
    },
    {
      to: "/tickets",
      icon: Ticket,
      label: "Tickets",
    },
    {
      to: "/slas",
      icon: Clock,
      label: "SLAs",
      allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"],
    },
    {
      to: "/automation",
      icon: Zap,
      label: "Automation",
      allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"],
    },
    {
      to: "/users",
      icon: UserCog,
      label: "Users",
      allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"],
    },
    // ==========================================
    // PLACEHOLDER LINKS - TO BE ADDED IN LATER PHASES
    // ==========================================
    // {
    //   to: "/notifications",
    //   icon: Bell,
    //   label: "Notifications",
    // },
  ];

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return user && item.allowedRoles.includes(user.role);
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          Ticketing Platform
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
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
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
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

        <Separator className="mb-3" />

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
  );
}
