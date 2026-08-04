import { z } from "zod";

import {
  AutomationAction,
  AutomationCondition,
  AutomationTrigger,
} from "../../../generated/prisma/client.js";

export const createAutomationRuleSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(3)
      .max(100),

    enabled: z
      .boolean()
      .optional(),

    trigger: z.nativeEnum(
      AutomationTrigger
    ),

    condition: z.nativeEnum(
      AutomationCondition
    ),

    conditionValue: z
      .string()
      .trim()
      .optional()
      .nullable(),

    action: z.nativeEnum(
      AutomationAction
    ),

    actionValue: z
      .string()
      .trim()
      .optional()
      .nullable(),
  });

export type CreateAutomationRuleDto =
  z.infer<
    typeof createAutomationRuleSchema
  >;