import type { PaginatedResponse } from "@/types/pagination.types";

/**
 * Automation rule trigger types
 */
export type AutomationTrigger =
  | "TICKET_CREATED"
  | "TICKET_UPDATED"
  | "COMMENT_CREATED"
  | "STATUS_CHANGED"
  | "SLA_BREACHED";

/**
 * Automation rule condition types
 */
export type AutomationCondition =
  | "ALWAYS"
  | "STATUS_IS"
  | "PRIORITY_IS"
  | "UNASSIGNED"
  | "RESPONSE_BREACHED"
  | "RESOLUTION_BREACHED";

/**
 * Automation rule action types
 */
export type AutomationAction =
  | "ASSIGN_AGENT"
  | "CHANGE_STATUS"
  | "CHANGE_PRIORITY"
  | "ADD_COMMENT"
  | "CLOSE_TICKET"
  | "REOPEN_TICKET"
  | "SEND_NOTIFICATION"
  | "SEND_EMAIL"
  | "WEBHOOK";

/**
 * Automation rule entity from the API
 */
export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  condition: AutomationCondition;
  conditionValue: string | null;
  action: AutomationAction;
  actionValue: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input for creating a new automation rule
 */
export interface CreateAutomationRuleInput {
  name: string;
  trigger: AutomationTrigger;
  condition: AutomationCondition;
  conditionValue: string | null;
  action: AutomationAction;
  actionValue: string | null;
}

/**
 * Input for updating an existing automation rule
 */
export interface UpdateAutomationRuleInput {
  name?: string;
  trigger?: AutomationTrigger;
  condition?: AutomationCondition;
  conditionValue?: string | null;
  action?: AutomationAction;
  actionValue?: string | null;
}

/**
 * Query parameters for listing automation rules
 */
export interface AutomationRuleListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  enabled?: boolean;
}

/**
 * Paginated response for automation rules list
 */
export type AutomationRulesResponse = PaginatedResponse<AutomationRule>;
