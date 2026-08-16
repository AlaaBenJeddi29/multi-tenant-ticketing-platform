import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrganization } from "../api/organization.api";
import { organizationKeys } from "../api/organization.queryKeys";
import type { UpdateOrganizationInput } from "../types/organization.types";
import { toast } from "sonner";

/**
 * Hook to update organization
 * SUPER_ADMIN only
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrganizationInput }) =>
      updateOrganization(id, input),

    onSuccess: (data) => {
      // Invalidate the specific organization query
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(data.id),
      });
      // Invalidate the list query
      queryClient.invalidateQueries({
        queryKey: organizationKeys.list(),
      });
      toast.success("Organization updated successfully");
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update organization");
    },
  });
}
