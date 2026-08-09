import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { ROUTES } from "@/app/router/routes";

export function useLogout() {
  const auth = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await auth.logout();
    },

    onSuccess: () => {
      navigate(ROUTES.LOGIN);
      console.log("User logged out");
    },

    onError: (error) => {
      console.error(error);
      // Still navigate to login even if server call failed
      navigate(ROUTES.LOGIN);
    },
  });
}
