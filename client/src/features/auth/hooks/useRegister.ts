import { useMutation } from "@tanstack/react-query";

import { register as registerRequest } from "../api/auth.api";

import { useAuth } from "../context/AuthContext";

export function useRegister() {
  const auth = useAuth();

  return useMutation({
    mutationFn: registerRequest,

    onSuccess: (response) => {
      auth.setUser(response.user);

      console.log("User registered");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
