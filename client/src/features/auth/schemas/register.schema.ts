import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    organizationName: z
      .string()
      .min(1, "Organization name is required")
      .min(2, "Organization name must be at least 2 characters")
      .max(100, "Organization name is too long"),
    organizationSlug: z
      .string()
      .min(1, "Organization slug is required")
      .min(3, "Organization slug must be at least 3 characters")
      .max(50, "Organization slug is too long")
      .regex(/^[a-z0-9-]+$/, "Organization slug can only contain lowercase letters, numbers, and hyphens")
      .regex(/^[a-z]/, "Organization slug must start with a letter")
      .regex(/[^-]$/, "Organization slug cannot end with a hyphen"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;