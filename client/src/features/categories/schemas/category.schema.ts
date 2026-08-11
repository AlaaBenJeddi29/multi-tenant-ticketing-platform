import { z } from "zod";

/**
 * Category form validation schema
 * Must match backend validation exactly to avoid confusing error mismatches
 */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
