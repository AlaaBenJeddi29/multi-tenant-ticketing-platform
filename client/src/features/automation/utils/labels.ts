import type {
  AutomationTrigger,
  AutomationCondition,
  AutomationAction,
} from "../types/automation.types";

/**
 * Human-readable labels for triggers
 */
export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  TICKET_CREATED: "Ticket Created",
  TICKET_UPDATED: "Ticket Updated",
  COMMENT_CREATED: "Comment Created",
  STATUS_CHANGED: "Status Changed",
  SLA_BREACHED: "SLA Breached",
};

/**
 * Human-readable labels for conditions
 */
export const CONDITION_LABELS: Record<AutomationCondition, string> = {
  ALWAYS: "Always",
  STATUS_IS: "Status Is",
  PRIORITY_IS: "Priority Is",
  UNASSIGNED: "Unassigned",
  RESPONSE_BREACHED: "Response Breached",
  RESOLUTION_BREACHED: "Resolution Breached",
};

/**
 * Human-readable labels for actions
 */
export const ACTION_LABELS: Record<AutomationAction, string> = {
  ASSIGN_AGENT: "Assign Agent",
  CHANGE_STATUS: "Change Status",
  CHANGE_PRIORITY: "Change Priority",
  ADD_COMMENT: "Add Comment",
  CLOSE_TICKET: "Close Ticket",
  REOPEN_TICKET: "Reopen Ticket",
  SEND_NOTIFICATION: "Send Notification",
  SEND_EMAIL: "Send Email",
  WEBHOOK: "Webhook",
};

/**
 * Conditions that don't require a value
 */
export const CONDITIONS_WITHOUT_VALUE: AutomationCondition[] = [
  "ALWAYS",
  "UNASSIGNED",
  "RESPONSE_BREACHED",
  "RESOLUTION_BREACHED",
];

/**
 * Actions that don't require a value
 */
export const ACTIONS_WITHOUT_VALUE: AutomationAction[] = [
  "CLOSE_TICKET",
  "REOPEN_TICKET",
];

/**
 * Check if condition requires a value
 */
export function conditionRequiresValue(condition: AutomationCondition): boolean {
  return !CONDITIONS_WITHOUT_VALUE.includes(condition);
}

/**
 * Check if action requires a value
 */
export function actionRequiresValue(action: AutomationAction): boolean {
  return !ACTIONS_WITHOUT_VALUE.includes(action);
}
