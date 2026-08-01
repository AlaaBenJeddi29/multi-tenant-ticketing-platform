import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),

  lastName: z.string().min(2).optional(),

  role: z
    .enum([
      "ORG_ADMIN",
      "AGENT",
    ])
    .optional(),
});

export type UpdateUserDto =
  z.infer<typeof updateUserSchema>;