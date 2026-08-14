import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgotPassword as forgotPasswordRequest } from "../api/auth.api";

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,

    onSuccess: () => {
      toast.success("If an account exists, a reset code has been sent.");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
