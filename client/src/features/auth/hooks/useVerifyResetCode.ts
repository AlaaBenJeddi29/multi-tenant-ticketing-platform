import { useMutation } from "@tanstack/react-query";

import { verifyResetCode as verifyResetCodeRequest } from "../api/auth.api";

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: verifyResetCodeRequest,

    onSuccess: () => {
      console.log("Reset code verified");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
