import { useQuery } from "@tanstack/react-query";

import { getAdminOrganizations } from "../api/admin.api";
import { adminKeys } from "../api/admin.queryKeys";

export function useAdminOrganizations(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return useQuery({
    queryKey: adminKeys.organizations(params),
    queryFn: () => getAdminOrganizations(params),
  });
}
