import type { PriorityListParams } from "../types/priority.types";

export const priorityKeys = {
  all: ["priorities"] as const,
  list: (params: PriorityListParams) => [...priorityKeys.all, "list", params] as const,
  detail: (id: string) => [...priorityKeys.all, "detail", id] as const,
};
