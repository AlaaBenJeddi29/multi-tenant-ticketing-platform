import { z } from "zod";

export const verifyResetCodeSchema = z.object({
  code: z.string().length(6),
});

export type VerifyResetCodeDto =
  z.infer<typeof verifyResetCodeSchema>;