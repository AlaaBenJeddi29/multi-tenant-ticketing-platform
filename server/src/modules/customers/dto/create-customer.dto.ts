import { z } from "zod";

export const createCustomerSchema = z.object({
  firstName: z.string().min(2),

  lastName: z.string().min(2),

  email: z.email(),

  phone: z.string().optional(),

  company: z.string().optional(),

  notes: z.string().optional(),
});

export type CreateCustomerDto =
  z.infer<typeof createCustomerSchema>;