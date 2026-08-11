import { useQuery } from "@tanstack/react-query";
import { getSlas } from "../api/sla.api";
import { slaKeys } from "../api/sla.queryKeys";
import type { SlaListParams } from "../types/sla.types";

/**
 * Hook to fetch paginated list of SLAs
 * Uses placeholderData to prevent loading flash during pagination
 */
export function useSlas(params: SlaListParams) {
  return useQuery({
    queryKey: slaKeys.list(params),
    queryFn: () => getSlas(params),
    placeholderData: (previousData) => previousData,
  });
}
