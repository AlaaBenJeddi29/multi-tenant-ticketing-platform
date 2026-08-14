import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { verifyResetCode as verifyResetCodeRequest } from "../api/auth.api";

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: verifyResetCodeRequest,

    onSuccess: () => {
      console.log("Reset code verified");
    },

    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Invalid or expired reset code.";
      toast.error(message);
    },
  });
}
