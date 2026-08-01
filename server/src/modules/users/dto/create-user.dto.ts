import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2),

  lastName: z.string().min(2),

  email: z.email(),

  password: z.string().min(8),

  role: z.enum([
    "ORG_ADMIN",
    "AGENT",
  ]),
});

export type CreateUserDto =
  z.infer<typeof createUserSchema>;