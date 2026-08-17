import { z } from "zod";

export const requesterFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must not exceed 100 characters")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .trim(),

  phone: z
    .string()
    .max(50, "Phone number must not exceed 50 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  company: z
    .string()
    .max(100, "Company must not exceed 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export type RequesterFormValues = z.infer<typeof requesterFormSchema>;
