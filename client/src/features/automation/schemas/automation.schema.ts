import { z } from "zod";

/**
 * Validation schema for creating/updating automation rules
 */
export const automationRuleSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  
  trigger: z.enum([
    "TICKET_CREATED",
    "TICKET_UPDATED",
    "COMMENT_CREATED",
    "STATUS_CHANGED",
    "SLA_BREACHED",
  ]),
  
  condition: z.enum([
    "ALWAYS",
    "STATUS_IS",
    "PRIORITY_IS",
    "UNASSIGNED",
    "RESPONSE_BREACHED",
    "RESOLUTION_BREACHED",
  ]),
  
  conditionValue: z.string().nullable(),
  
  action: z.enum([
    "ASSIGN_AGENT",
    "CHANGE_STATUS",
    "CHANGE_PRIORITY",
    "ADD_COMMENT",
    "CLOSE_TICKET",
    "REOPEN_TICKET",
    "SEND_NOTIFICATION",
    "SEND_EMAIL",
    "WEBHOOK",
  ]),
  
  actionValue: z.string().nullable(),
}).superRefine((data, ctx) => {
  // Validate conditionValue based on condition
  if (data.condition === "STATUS_IS" || data.condition === "PRIORITY_IS") {
    if (!data.conditionValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Condition value is required for ${data.condition}`,
        path: ["conditionValue"],
      });
    }
  }
  
  // Validate actionValue based on action
  if (
    data.action === "ASSIGN_AGENT" ||
    data.action === "CHANGE_STATUS" ||
    data.action === "CHANGE_PRIORITY"
  ) {
    if (!data.actionValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Action value is required for ${data.action}`,
        path: ["actionValue"],
      });
    }
  }

  // Validate actionValue with minimum length for text-based actions
  if (
    data.action === "ADD_COMMENT" ||
    data.action === "SEND_NOTIFICATION" ||
    data.action === "SEND_EMAIL"
  ) {
    if (!data.actionValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Action value is required for ${data.action}`,
        path: ["actionValue"],
      });
    } else if (data.actionValue.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Action value must be at least 5 characters`,
        path: ["actionValue"],
      });
    }
  }
  
  // Validate URL for WEBHOOK action
  if (data.action === "WEBHOOK") {
    if (!data.actionValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Webhook URL is required",
        path: ["actionValue"],
      });
    } else {
      try {
        new URL(data.actionValue);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be a valid URL",
          path: ["actionValue"],
        });
      }
    }
  }
});

export type AutomationRuleFormData = z.infer<typeof automationRuleSchema>;
