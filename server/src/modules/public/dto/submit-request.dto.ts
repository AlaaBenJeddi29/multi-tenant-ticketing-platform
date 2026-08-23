import { z } from "zod";

export const submitRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
  subject: z.string().min(10, "Subject must be at least 10 characters").max(200, "Subject must not exceed 200 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description must not exceed 2000 characters"),
});

export type SubmitRequestDto = z.infer<typeof submitRequestSchema>;
