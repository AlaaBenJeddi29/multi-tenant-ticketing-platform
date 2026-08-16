import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "../api/admin.api";
import { adminKeys } from "../api/admin.queryKeys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: getAdminDashboard,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
