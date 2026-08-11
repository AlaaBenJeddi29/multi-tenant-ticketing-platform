import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export function toPriorityResponse(
  priority: any
) {
  return {
    id: priority.id,
    name: priority.name,
    level: priority.level,
    color: priority.color,
    isActive: priority.isActive,
    createdAt: priority.createdAt,
    updatedAt: priority.updatedAt,
  };
}

export function toPrioritiesResponse(
  priorities: any[]
) {
  return priorities.map(
    toPriorityResponse
  );
}

export function toPrioritiesListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: any[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toPriorityResponse>> {
  return {
    data: items.map(toPriorityResponse),
    meta: buildMeta(total, page, pageSize),
  };
}