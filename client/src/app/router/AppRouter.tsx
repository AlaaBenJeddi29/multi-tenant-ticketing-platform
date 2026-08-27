import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import VerifyResetCodePage from "@/features/auth/pages/VerifyResetCodePage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import SubmitRequestPage from "@/features/public/pages/SubmitRequestPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import PrioritiesPage from "@/features/priorities/pages/PrioritiesPage";
import AssetsPage from "@/features/assets/pages/AssetsPage";
import RequestersPage from "@/features/requesters/pages/RequestersPage";
import TicketsListPage from "@/features/tickets/pages/TicketsListPage";
import CreateTicketPage from "@/features/tickets/pages/CreateTicketPage";
import TicketDetailPage from "@/features/tickets/pages/TicketDetailPage";
import NotFoundPage from "@/features/errors/pages/NotFoundPage";
import ForbiddenPage from "@/features/errors/pages/ForbiddenPage";
import RequireAuth from "@/features/auth/components/RequireAuth";
import RequireRole from "@/features/auth/components/RequireRole";
import { SlasPage } from "@/features/sla";
import { AutomationPage } from "@/features/automation";
import AutomationExecutionsPage from "@/features/automation/pages/AutomationExecutionsPage";
import { UsersPage } from "@/features/users";
import { NotificationsPage } from "@/features/notifications";
import OrganizationsListPage from "@/features/admin/pages/OrganizationsListPage";
import OrganizationDetailPage from "@/features/admin/pages/OrganizationDetailPage";
import AdminLayout from "@/features/admin/components/AdminLayout";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage";
import AdminAnalyticsPage from "@/features/admin/pages/AdminAnalyticsPage";
import AdminActivityPage from "@/features/admin/pages/AdminActivityPage";
import AdminSystemHealthPage from "@/features/admin/pages/AdminSystemHealthPage";
import AdminSettingsPage from "@/features/admin/pages/AdminSettingsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

import { ROUTES } from "./routes";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      {
        element: <PublicLayout />,
        children: [
          { path: ROUTES.HOME, element: <HomePage /> },
          { path: "/home", element: <HomePage /> },
          { path: ROUTES.HOME_WITH_SLUG, element: <HomePage /> },
        ],
      },
      // Auth routes (full viewport width, no PublicLayout centering)
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
      { path: ROUTES.VERIFY_RESET_CODE, element: <VerifyResetCodePage /> },
      { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
      // Standalone public route (no layout)
      { path: ROUTES.SUBMIT_REQUEST, element: <SubmitRequestPage /> },
      // Protected routes
      {
        element: <RequireAuth />,
        children: [
          // SUPER_ADMIN-only routes (standalone AdminLayout, no ProtectedLayout)
          {
            element: <RequireRole roles={["SUPER_ADMIN"]} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: ROUTES.ADMIN_DASHBOARD, element: <AdminDashboardPage /> },
                  { path: ROUTES.ADMIN_ORGANIZATIONS, element: <OrganizationsListPage /> },
                  { path: ROUTES.ADMIN_ORGANIZATION_DETAIL, element: <OrganizationDetailPage /> },
                  { path: ROUTES.ADMIN_USERS, element: <AdminUsersPage /> },
                  { path: ROUTES.ADMIN_ANALYTICS, element: <AdminAnalyticsPage /> },
                  { path: ROUTES.ADMIN_ACTIVITY, element: <AdminActivityPage /> },
                  { path: ROUTES.ADMIN_SYSTEM_HEALTH, element: <AdminSystemHealthPage /> },
                  { path: ROUTES.ADMIN_SETTINGS, element: <AdminSettingsPage /> },
                  { path: ROUTES.SETTINGS, element: <SettingsPage /> },
                ],
              },
            ],
          },
          // ORG_ADMIN and AGENT routes (wrapped in ProtectedLayout)
          {
            element: <RequireRole roles={["ORG_ADMIN", "AGENT"]} />,
            children: [
              {
                element: <ProtectedLayout />,
                children: [
                  { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
                  { path: ROUTES.CATEGORIES, element: <CategoriesPage /> },
                  { path: ROUTES.PRIORITIES, element: <PrioritiesPage /> },
                  { path: ROUTES.ASSETS, element: <AssetsPage /> },
                  { path: ROUTES.REQUESTERS, element: <RequestersPage /> },
                  { path: ROUTES.TICKETS, element: <TicketsListPage /> },
                  { path: ROUTES.TICKET_NEW, element: <CreateTicketPage /> },
                  { path: ROUTES.TICKET_DETAIL, element: <TicketDetailPage /> },
                  { path: ROUTES.SLAS, element: <SlasPage /> },
                  { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
                  { path: ROUTES.SETTINGS, element: <SettingsPage /> },
                  // ORG_ADMIN-only routes
                  {
                    element: <RequireRole roles={["ORG_ADMIN"]} />,
                    children: [
                      { path: ROUTES.AUTOMATION, element: <AutomationPage /> },
                      { path: ROUTES.AUTOMATION_EXECUTIONS, element: <AutomationExecutionsPage /> },
                      { path: ROUTES.USERS, element: <UsersPage /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      // Error pages
      { path: ROUTES.FORBIDDEN, element: <ForbiddenPage /> },
      // 404 catch-all
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}