import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { resetPassword as resetPasswordRequest } from "../api/auth.api";
import { ROUTES } from "@/app/router/routes";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordRequest,

    onSuccess: () => {
      console.log("Password reset successfully");
      
      // Navigate to login with query param to show success banner
      navigate(`${ROUTES.LOGIN}?reset=true`, { replace: true });
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
