import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(100),
});

export type UpdateOrganizationDto =
  z.infer<typeof updateOrganizationSchema>;