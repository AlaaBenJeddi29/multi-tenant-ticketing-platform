import { useMutation } from "@tanstack/react-query";

import { resetPassword as resetPasswordRequest } from "../api/auth.api";

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordRequest,

    onSuccess: () => {
      console.log("Password reset successfully");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
