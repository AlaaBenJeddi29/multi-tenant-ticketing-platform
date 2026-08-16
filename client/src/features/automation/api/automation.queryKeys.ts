import type { AutomationRuleListParams } from "../types/automation.types";

/**
 * Hierarchical query keys for automation rules
 * 
 * Structure:
 * - automationKeys.all: Invalidates everything
 * - automationKeys.lists(): Invalidates all lists
 * - automationKeys.list(params): Specific list with filters
 * - automationKeys.details(): Invalidates all details
 * - automationKeys.detail(id): Specific automation rule detail
 * - automationKeys.executions(params): Execution history
 */
export const automationKeys = {
  all: ["automation"] as const,
  
  lists: () => [...automationKeys.all, "list"] as const,
  
  list: (params: AutomationRuleListParams) =>
    [...automationKeys.lists(), params] as const,
  
  details: () => [...automationKeys.all, "detail"] as const,
  
  detail: (id: string) => [...automationKeys.details(), id] as const,
  
  executions: (params: { page: number; pageSize: number }) =>
    [...automationKeys.all, "executions", params] as const,
};
