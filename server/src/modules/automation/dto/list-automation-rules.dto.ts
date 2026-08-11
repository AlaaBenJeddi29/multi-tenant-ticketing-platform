import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";
import { AutomationTrigger } from "../../../generated/prisma/client.js";

export const listAutomationRulesQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  trigger: z
    .nativeEnum(AutomationTrigger)
    .optional(),

  enabled: z.coerce
    .boolean()
    .optional(),

  sortBy: z
    .enum(["name", "createdAt"])
    .default("createdAt"),
});

export type ListAutomationRulesQuery = z.infer<typeof listAutomationRulesQuerySchema>;
