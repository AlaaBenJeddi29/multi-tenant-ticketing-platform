import { z } from "zod";

export const createPrioritySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(50),

    level: z.enum([
      "LOW",
      "MEDIUM",
      "HIGH",
      "CRITICAL",
    ]),

    color: z
      .string()
      .trim()
      .min(3)
      .max(20),
  });

export type CreatePriorityDto =
  z.infer<typeof createPrioritySchema>;