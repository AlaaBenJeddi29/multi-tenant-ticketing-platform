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