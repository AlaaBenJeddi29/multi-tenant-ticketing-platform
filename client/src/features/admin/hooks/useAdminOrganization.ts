import { useQuery } from "@tanstack/react-query";

import { getAdminOrganization } from "../api/admin.api";
import { adminKeys } from "../api/admin.queryKeys";

export function useAdminOrganization(id: string) {
  return useQuery({
    queryKey: adminKeys.organization(id),
    queryFn: () => getAdminOrganization(id),
    enabled: Boolean(id),
  });
}
