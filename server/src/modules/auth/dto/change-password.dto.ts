import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),

    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/),

    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordDto =
  z.infer<typeof changePasswordSchema>;