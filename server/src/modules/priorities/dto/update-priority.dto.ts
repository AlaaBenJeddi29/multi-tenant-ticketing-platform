import { z } from "zod";

export const updatePrioritySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .optional(),

    level: z
      .enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ])
      .optional(),

    color: z
      .string()
      .trim()
      .min(3)
      .max(20)
      .optional(),

    isActive:
      z.boolean().optional(),
  });

export type UpdatePriorityDto =
  z.infer<typeof updatePrioritySchema>;