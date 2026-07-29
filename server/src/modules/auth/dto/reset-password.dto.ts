import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    code: z.string().length(6),

    password: z.string().min(8),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type ResetPasswordDto =
  z.infer<typeof resetPasswordSchema>;