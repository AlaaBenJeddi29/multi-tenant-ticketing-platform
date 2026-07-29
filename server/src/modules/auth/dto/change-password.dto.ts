import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),

    newPassword: z.string().min(8),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type ChangePasswordDto =
  z.infer<typeof changePasswordSchema>;