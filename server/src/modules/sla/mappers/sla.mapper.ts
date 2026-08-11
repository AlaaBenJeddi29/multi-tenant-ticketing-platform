import type {
  Sla,
  Priority,
} from "../../../generated/prisma/client.js";
import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export interface SlaWithPriority
  extends Sla {
  priority: Priority;
}

export function toSlaResponse(
  sla: SlaWithPriority
) {
  return {
    id: sla.id,

    name: sla.name,

    responseTimeMinutes:
      sla.responseTimeMinutes,

    resolutionTimeMinutes:
      sla.resolutionTimeMinutes,

    isActive: sla.isActive,

    priority: sla.priority,

    createdAt: sla.createdAt,

    updatedAt: sla.updatedAt,
  };
}

export function toSlasResponse(
  slas: SlaWithPriority[]
) {
  return slas.map(toSlaResponse);
}

export function toSlasListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: SlaWithPriority[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toSlaResponse>> {
  return {
    data: items.map(toSlaResponse),
    meta: buildMeta(total, page, pageSize),
  };
}