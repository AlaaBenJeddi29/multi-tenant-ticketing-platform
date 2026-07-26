import { useMutation } from "@tanstack/react-query";

import { login as loginRequest } from "../api/auth.api";

import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const auth = useAuth();

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: (response) => {
      auth.login(response.accessToken, response.user);

      console.log("User logged in");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}