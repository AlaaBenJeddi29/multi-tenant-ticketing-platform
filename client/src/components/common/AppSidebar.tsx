import { NavLink } from "react-router-dom";
import { useState } from "react";
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
  LogOut,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { NotificationBell } from "@/features/notifications";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      allowedRoles: ["ORG_ADMIN"],
    },
    {
      to: "/automation/executions",
      icon: History,
      label: "Execution History",
      allowedRoles: ["ORG_ADMIN"],
    },
    {
      to: "/users",
      icon: UserCog,
      label: "Users",
      allowedRoles: ["ORG_ADMIN"],
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
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            Ticketing Platform
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "ml-auto shrink-0",
            isCollapsed && "mx-auto"
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
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
                        : "text-sidebar-foreground",
                      isCollapsed && "justify-center px-2"
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-2">
        <div className={cn(
          "mb-3 flex flex-col gap-3 px-2",
          isCollapsed && "items-center"
        )}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  {user?.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
          )}
          <div className={cn(
            "flex items-center gap-1",
            isCollapsed ? "flex-col" : "justify-end"
          )}>
            <ThemeToggle />
            <NotificationBell />
          </div>
        </div>

        {!isCollapsed && <Separator className="mb-3" />}

        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "mx-auto" : "w-full justify-start gap-2"
          )}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="size-4 shrink-0" />
          {!isCollapsed && (
            <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
          )}
        </Button>
      </div>
    </aside>
  );
}
