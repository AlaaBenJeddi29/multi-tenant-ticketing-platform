import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { register as registerRequest } from "../api/auth.api";
import { ROUTES } from "@/app/router/routes";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerRequest,

    onSuccess: (response) => {
      // Backend returns: { message: "User registered successfully." }
      // User is NOT automatically logged in after registration
      console.log("User registered successfully:", response.message);
      
      // Navigate to login with query param to show success banner
      navigate(`${ROUTES.LOGIN}?registered=true`, { replace: true });
    },

    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
}
