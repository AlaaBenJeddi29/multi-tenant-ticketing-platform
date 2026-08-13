import { z } from "zod";

export const verifyResetCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must be 6 digits"),
});

export type VerifyResetCodeFormData = z.infer<typeof verifyResetCodeSchema>;
