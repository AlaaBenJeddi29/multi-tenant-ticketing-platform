import type { SlaListParams } from "../types/sla.types";

/**
 * Hierarchical query keys for SLAs
 * 
 * Structure:
 * - slaKeys.all: Invalidates everything
 * - slaKeys.lists(): Invalidates all lists
 * - slaKeys.list(params): Specific list with filters
 * - slaKeys.details(): Invalidates all details
 * - slaKeys.detail(id): Specific SLA detail
 */
export const slaKeys = {
  all: ["slas"] as const,
  
  lists: () => [...slaKeys.all, "list"] as const,
  
  list: (params: SlaListParams) =>
    [...slaKeys.lists(), params] as const,
  
  details: () => [...slaKeys.all, "detail"] as const,
  
  detail: (id: string) => [...slaKeys.details(), id] as const,
};
