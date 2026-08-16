import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "../api/organization.api";
import { organizationKeys } from "../api/organization.queryKeys";

/**
 * Hook to fetch all organizations
 * SUPER_ADMIN only
 */
export function useOrganizationsList() {
  return useQuery({
    queryKey: organizationKeys.list(),
    queryFn: getOrganizations,
  });
}
