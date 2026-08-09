import { useMutation } from "@tanstack/react-query";

import { forgotPassword as forgotPasswordRequest } from "../api/auth.api";

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,

    onSuccess: () => {
      console.log("Password reset email sent");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
