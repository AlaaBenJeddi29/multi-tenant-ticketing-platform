import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import PrioritiesPage from "@/features/priorities/pages/PrioritiesPage";
import AssetsPage from "@/features/assets/pages/AssetsPage";
import RequestersPage from "@/features/requesters/pages/RequestersPage";
import TicketsListPage from "@/features/tickets/pages/TicketsListPage";
import CreateTicketPage from "@/features/tickets/pages/CreateTicketPage";
import TicketDetailPage from "@/features/tickets/pages/TicketDetailPage";
import NotFoundPage from "@/features/errors/pages/NotFoundPage";
import RequireAuth from "@/features/auth/components/RequireAuth";
import { SlasPage } from "@/features/sla";
import { AutomationPage } from "@/features/automation";
import { UsersPage } from "@/features/users";
import { NotificationsPage } from "@/features/notifications";

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
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
          { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
        ],
      },
      // Protected routes
      {
        element: <RequireAuth />,
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
              { path: ROUTES.AUTOMATION, element: <AutomationPage /> },
              { path: ROUTES.USERS, element: <UsersPage /> },
              { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
            ],
          },
        ],
      },
      // 404 catch-all
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}