import { z } from "zod";

/**
 * Validation schema for creating a user
 * Matches backend create-user.dto.ts exactly
 */
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be 50 characters or less")
    .trim(),
  
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be 50 characters or less")
    .trim(),
  
  email: z
    .string()
    .email("Must be a valid email address")
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be 100 characters or less"),
  
  role: z.enum(["ORG_ADMIN", "AGENT"]),
});

/**
 * Validation schema for updating a user
 * Matches backend update-user.dto.ts exactly
 * Note: Password cannot be updated here
 */
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be 50 characters or less")
    .trim()
    .optional(),
  
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be 50 characters or less")
    .trim()
    .optional(),
  
  role: z
    .enum(["ORG_ADMIN", "AGENT"])
    .optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
