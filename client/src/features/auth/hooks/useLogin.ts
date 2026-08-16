import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { login as loginRequest } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "@/app/router/routes";

export function useLogin() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: (response) => {
      auth.setUser(response.user);

      // Redirect SUPER_ADMIN to admin panel, others to dashboard
      // Or redirect back to where RequireAuth intercepted them
      const state = location.state as { from?: { pathname: string } } | null;
      const interceptedPath = state?.from?.pathname;

      let destination: string;
      if (interceptedPath) {
        destination = interceptedPath;
      } else if (response.user.role === "SUPER_ADMIN") {
        destination = ROUTES.ADMIN_DASHBOARD;
      } else {
        destination = ROUTES.DASHBOARD;
      }

      navigate(destination, { replace: true });
    },

    onError: () => {
      toast.error("Invalid email or password.");
    },
  });
}