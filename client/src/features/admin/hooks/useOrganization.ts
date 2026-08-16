import { useQuery } from "@tanstack/react-query";
import { getOrganizationById } from "../api/organization.api";
import { organizationKeys } from "../api/organization.queryKeys";

/**
 * Hook to fetch organization by ID
 * SUPER_ADMIN only
 */
export function useOrganization(id: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => getOrganizationById(id),
    enabled: !!id,
  });
}
