import { z } from "zod";

import {
  AutomationAction,
  AutomationCondition,
  AutomationTrigger,
} from "../../../generated/prisma/client.js";

const TICKET_STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export const updateAutomationRuleSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(3)
      .max(100)
      .optional(),

    enabled: z
      .boolean()
      .optional(),

    trigger: z
      .nativeEnum(
        AutomationTrigger
      )
      .optional(),

    condition: z
      .nativeEnum(
        AutomationCondition
      )
      .optional(),

    conditionValue: z
      .string()
      .trim()
      .nullable()
      .optional(),

    action: z
      .nativeEnum(
        AutomationAction
      )
      .optional(),

    actionValue: z
      .string()
      .trim()
      .nullable()
      .optional(),
  }).superRefine((data, ctx) => {
    // Validate actionValue based on action type (only if action is being updated)
    if (data.action === AutomationAction.ASSIGN_AGENT) {
      if (!data.actionValue || data.actionValue.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Agent selection is required",
          path: ["actionValue"],
        });
      }
    }

    if (data.action === AutomationAction.CHANGE_STATUS) {
      if (!data.actionValue || !TICKET_STATUSES.includes(data.actionValue as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid status value",
          path: ["actionValue"],
        });
      }
    }

    if (data.action === AutomationAction.CHANGE_PRIORITY) {
      if (!data.actionValue || data.actionValue.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Priority selection is required",
          path: ["actionValue"],
        });
      }
    }

    if (data.action === AutomationAction.ADD_COMMENT) {
      if (!data.actionValue || data.actionValue.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Comment text is required (minimum 5 characters)",
          path: ["actionValue"],
        });
      }
    }

    if (data.action === AutomationAction.SEND_NOTIFICATION) {
      if (!data.actionValue || data.actionValue.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Notification message is required (minimum 5 characters)",
          path: ["actionValue"],
        });
      }
    }

    if (data.action === AutomationAction.SEND_EMAIL) {
      if (!data.actionValue || data.actionValue.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email message is required (minimum 5 characters)",
          path: ["actionValue"],
        });
      }
    }
  });

export type UpdateAutomationRuleDto =
  z.infer<
    typeof updateAutomationRuleSchema
  >;