import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).optional(),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

export type UpdateOrganizationDto =
  z.infer<typeof updateOrganizationSchema>;