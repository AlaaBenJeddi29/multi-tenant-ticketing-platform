import type { RequesterListParams } from "../types/requester.types";

export const requesterKeys = {
  all: ["requesters"] as const,
  list: (params: RequesterListParams) => [...requesterKeys.all, "list", params] as const,
  detail: (id: string) => [...requesterKeys.all, "detail", id] as const,
};
