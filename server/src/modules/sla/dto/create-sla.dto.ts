import { z } from "zod";

export const createSlaSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100),

  priorityId: z.string().cuid(),

  responseTimeMinutes: z
    .number()
    .int()
    .positive(),

  resolutionTimeMinutes: z
    .number()
    .int()
    .positive(),

  isActive: z
    .boolean()
    .optional(),
});

export type CreateSlaDto =
  z.infer<typeof createSlaSchema>;