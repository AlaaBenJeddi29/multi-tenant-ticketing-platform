import type {
  Sla,
  Priority,
} from "../../../generated/prisma/client.js";

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