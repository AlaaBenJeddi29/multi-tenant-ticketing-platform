import { api } from "@/api/client";
import type { PriorityListParams, PrioritiesResponse } from "../types/priority.types";

export async function getPriorities(params: PriorityListParams): Promise<PrioritiesResponse> {
  const { data } = await api.get<PrioritiesResponse>("/priorities", { params });
  return data;
}
