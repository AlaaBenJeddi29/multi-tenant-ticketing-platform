import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import NotFoundPage from "@/features/errors/pages/NotFoundPage";

import { ROUTES } from "./routes";

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
        path: "*",                    // ← Catch all unmatched routes
        element: <NotFoundPage />,    // ← Use "element", NOT "errorElement"
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}