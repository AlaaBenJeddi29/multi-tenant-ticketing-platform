import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthContext";

import { getDashboardOverview } from "../api/dashboard.api";
import { dashboardKeys } from "../api/dashboard.queryKeys";

export function useDashboardOverview() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: dashboardKeys.overview(tenantId ?? "unknown"),
    queryFn: getDashboardOverview,
    enabled: Boolean(tenantId),
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}