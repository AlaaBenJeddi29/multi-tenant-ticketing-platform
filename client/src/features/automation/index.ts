// Types
export type {
  AutomationRule,
  AutomationTrigger,
  AutomationCondition,
  AutomationAction,
  CreateAutomationRuleInput,
  UpdateAutomationRuleInput,
  AutomationRuleListParams,
  AutomationRulesResponse,
} from "./types/automation.types";

// API
export * from "./api/automation.api";
export { automationKeys } from "./api/automation.queryKeys";

// Hooks
export { useAutomationRules } from "./hooks/useAutomationRules";
export { useAutomationRule } from "./hooks/useAutomationRule";
export { useCreateAutomationRule } from "./hooks/useCreateAutomationRule";
export { useUpdateAutomationRule } from "./hooks/useUpdateAutomationRule";
export { useActivateAutomationRule } from "./hooks/useActivateAutomationRule";
export { useDeactivateAutomationRule } from "./hooks/useDeactivateAutomationRule";
export { useDeleteAutomationRule } from "./hooks/useDeleteAutomationRule";

// Components
export { AutomationTable } from "./components/AutomationTable";
export { AutomationFormDialog } from "./components/AutomationFormDialog";

// Utils
export * from "./utils/labels";

// Pages
export { default as AutomationPage } from "./pages/AutomationPage";
