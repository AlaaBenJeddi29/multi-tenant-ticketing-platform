import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { register as registerRequest } from "../api/auth.api";
import { ROUTES } from "@/app/router/routes";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerRequest,

    onSuccess: () => {
      toast.success("Account created — please log in.");
      navigate(ROUTES.LOGIN, { replace: true });
    },

    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
}
