import { z } from "zod";

export const createRequesterSchema = z.object({
  firstName: z.string().min(2),

  lastName: z.string().min(2),

  email: z.email(),

  phone: z.string().optional(),

  company: z.string().optional(),

  notes: z.string().optional(),
});

export type CreateRequesterDto =
  z.infer<typeof createRequesterSchema>;