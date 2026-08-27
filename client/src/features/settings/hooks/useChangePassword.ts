import { useMutation } from "@tanstack/react-query";

import { changePassword } from "../api/settings.api";
import type { ChangePasswordRequest } from "../types/settings.types";
import { useToast } from "@/hooks/use-toast";

export function useChangePassword() {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  return {
    changePassword: mutation.mutate,
    isChanging: mutation.isPending,
  };
}
