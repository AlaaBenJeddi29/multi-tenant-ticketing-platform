import { z } from "zod";

import {
  AutomationAction,
  AutomationCondition,
  AutomationTrigger,
} from "../../../generated/prisma/client.js";

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
  });

export type UpdateAutomationRuleDto =
  z.infer<
    typeof updateAutomationRuleSchema
  >;