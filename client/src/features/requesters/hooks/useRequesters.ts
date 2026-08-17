import { useQuery } from "@tanstack/react-query";
import { getRequesters } from "../api/requester.api";
import { requesterKeys } from "../api/requester.queryKeys";
import type { RequesterListParams } from "../types/requester.types";

export function useRequesters(params: RequesterListParams = {}) {
  return useQuery({
    queryKey: requesterKeys.list(params),
    queryFn: () => getRequesters(params),
    placeholderData: (previousData) => previousData,
  });
}
