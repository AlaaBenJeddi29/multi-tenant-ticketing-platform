import { useQuery } from "@tanstack/react-query";
import { getPriorities } from "../api/priority.api";
import type { PriorityListParams } from "../types/priority.types";

const PRIORITIES_QUERY_KEY = "priorities";

export function usePriorities(params: PriorityListParams = {}) {
  return useQuery({
    queryKey: [PRIORITIES_QUERY_KEY, params],
    queryFn: () => getPriorities(params),
    placeholderData: (previousData) => previousData,
  });
}
