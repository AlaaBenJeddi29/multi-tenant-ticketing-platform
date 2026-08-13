import { api } from "@/api/client";
import type {
  AutomationRule,
  AutomationRulesResponse,
  AutomationRuleListParams,
  CreateAutomationRuleInput,
  UpdateAutomationRuleInput,
} from "../types/automation.types";

const BASE_URL = "/automation";

/**
 * Get paginated list of automation rules
 * Requires ORG_ADMIN role
 */
export async function getAutomationRules(
  params: AutomationRuleListParams
): Promise<AutomationRulesResponse> {
  const response = await api.get<AutomationRulesResponse>(BASE_URL, { params });
  return response.data;
}

/**
 * Get a single automation rule by ID
 * Requires ORG_ADMIN role
 */
export async function getAutomationRuleById(id: string): Promise<AutomationRule> {
  const response = await api.get<AutomationRule>(`${BASE_URL}/${id}`);
  return response.data;
}

/**
 * Create a new automation rule
 * Requires ORG_ADMIN role
 */
export async function createAutomationRule(
  input: CreateAutomationRuleInput
): Promise<AutomationRule> {
  const response = await api.post<AutomationRule>(BASE_URL, input);
  return response.data;
}

/**
 * Update an existing automation rule
 * Requires ORG_ADMIN role
 */
export async function updateAutomationRule(
  id: string,
  input: UpdateAutomationRuleInput
): Promise<AutomationRule> {
  const response = await api.patch<AutomationRule>(`${BASE_URL}/${id}`, input);
  return response.data;
}

/**
 * Activate an automation rule
 * Requires ORG_ADMIN role
 */
export async function activateAutomationRule(id: string): Promise<AutomationRule> {
  const response = await api.patch<AutomationRule>(`${BASE_URL}/${id}/activate`);
  return response.data;
}

/**
 * Deactivate an automation rule
 * Requires ORG_ADMIN role
 */
export async function deactivateAutomationRule(id: string): Promise<AutomationRule> {
  const response = await api.patch<AutomationRule>(`${BASE_URL}/${id}/deactivate`);
  return response.data;
}

/**
 * Delete an automation rule
 * Requires ORG_ADMIN role
 */
export async function deleteAutomationRule(id: string): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}
