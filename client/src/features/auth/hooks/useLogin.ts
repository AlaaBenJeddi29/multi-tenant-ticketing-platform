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

      // Redirect back to where RequireAuth intercepted them, or to dashboard
      const state = location.state as { from?: { pathname: string } } | null;
      const destination = state?.from?.pathname ?? ROUTES.DASHBOARD;
      navigate(destination, { replace: true });
    },

    onError: () => {
      toast.error("Invalid email or password.");
    },
  });
}