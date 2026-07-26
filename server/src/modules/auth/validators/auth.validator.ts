import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),

  email: z.email(),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),

  organizationName: z.string().min(2),

  organizationSlug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),
});

export type RegisterInput = z.infer<typeof registerSchema>;