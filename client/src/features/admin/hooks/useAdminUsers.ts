import { useQuery } from "@tanstack/react-query";

import { getAdminUsers } from "../api/admin.api";
import { adminKeys } from "../api/admin.queryKeys";

export function useAdminUsers(params: {
  page: number;
  pageSize: number;
  search?: string;
  organizationId?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => getAdminUsers(params),
  });
}
