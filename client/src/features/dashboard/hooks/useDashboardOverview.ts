import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthContext";

import { getDashboardOverview } from "../api/dashboard.api";
import { dashboardKeys } from "../api/dashboard.queryKeys";

export function useDashboardOverview() {
  const { user } = useAuth();
  const organizationId = user?.organizationId;

  return useQuery({
    queryKey: dashboardKeys.overview(organizationId ?? "unknown"),
    queryFn: getDashboardOverview,
    enabled: Boolean(organizationId),
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}