import { z } from "zod";

/**
 * SLA form validation schema
 * Must match backend validation exactly
 */
export const slaFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  priorityId: z
    .string()
    .optional(),

  responseTimeMinutes: z
    .number()
    .int("Response time must be a whole number")
    .min(1, "Response time must be at least 1 minute")
    .max(43200, "Response time must not exceed 30 days (43,200 minutes)"),

  resolutionTimeMinutes: z
    .number()
    .int("Resolution time must be a whole number")
    .min(1, "Resolution time must be at least 1 minute")
    .max(43200, "Resolution time must not exceed 30 days (43,200 minutes)"),
});

export type SlaFormValues = z.infer<typeof slaFormSchema>;
