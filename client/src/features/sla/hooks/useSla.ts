import { useQuery } from "@tanstack/react-query";
import { getSlaById } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";

/**
 * Hook to fetch a single SLA by ID
 */
export function useSla(id: string) {
  return useQuery({
    queryKey: slaKeys.detail(id),
    queryFn: () => getSlaById(id),
    enabled: !!id,
  });
}
