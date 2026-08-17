import { useQuery } from "@tanstack/react-query";
import { getPriorities } from "../api/priority.api";
import { priorityKeys } from "../api/priority.queryKeys";
import type { PriorityListParams } from "../types/priority.types";

export function usePriorities(params: PriorityListParams = {}) {
  return useQuery({
    queryKey: priorityKeys.list(params),
    queryFn: () => getPriorities(params),
    placeholderData: (previousData) => previousData,
  });
}
