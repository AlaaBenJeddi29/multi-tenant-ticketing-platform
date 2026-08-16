import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { suspendOrganization, activateOrganization } from "../api/admin.api";
import { adminKeys } from "../api/admin.queryKeys";

export function useSuspendOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations() });
      toast.success("Organization suspended successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to suspend organization");
    },
  });
}

export function useActivateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations() });
      toast.success("Organization activated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to activate organization");
    },
  });
}
