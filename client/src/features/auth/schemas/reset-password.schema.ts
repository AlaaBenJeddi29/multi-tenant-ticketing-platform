import { z } from "zod";

export const verifyResetCodeSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must contain 6 digits")
    .max(6, "Verification code must contain 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/\d/, "Password must contain a number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type VerifyResetCodeFormData = z.infer<
  typeof verifyResetCodeSchema
>;

export type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>;