import { z } from "zod";

export const priorityFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  level: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  color: z
    .string()
    .min(3, "Color must be at least 3 characters")
    .max(20, "Color must not exceed 20 characters")
    .trim(),
});

export type PriorityFormValues = z.infer<typeof priorityFormSchema>;
