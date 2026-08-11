import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import NotFoundPage from "@/features/errors/pages/NotFoundPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

import { ROUTES } from "./routes";

import RegisterPage from "@/features/auth/pages/RegisterPage";

import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

import { SlasPage } from "@/features/sla";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage/>,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTES.RESET_PASSWORD ,
        element: <ResetPasswordPage />,
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <ProtectedLayout />,
            children: [
              {
                path: ROUTES.SLAS,
                element: <SlasPage />,
              },
            ],
          },
        ],
      },
      {
        path: "*",                    // ← Catch all unmatched routes
        element: <NotFoundPage />,    // ← Use "element", NOT "errorElement"
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}