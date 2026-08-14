import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { resetPassword as resetPasswordRequest } from "../api/auth.api";
import { ROUTES } from "@/app/router/routes";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordRequest,

    onSuccess: () => {
      toast.success("Password updated — please log in.");
      navigate(ROUTES.LOGIN, { replace: true });
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
