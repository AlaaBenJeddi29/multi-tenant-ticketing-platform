import { z } from "zod";

export const updateAssetSchema = z.object({
  name: z.string().trim().min(2).optional(),

  assetTag: z.string().trim().optional(),

  manufacturer: z.string().trim().optional(),

  model: z.string().trim().optional(),

  serialNumber: z.string().trim().optional(),

  purchaseDate: z.coerce.date().optional(),

  warrantyUntil: z.coerce.date().optional(),

  location: z.string().trim().optional(),

  notes: z.string().trim().optional(),

  status: z
    .enum([
      "ACTIVE",
      "IN_MAINTENANCE",
      "RETIRED",
    ])
    .optional(),
});

export type UpdateAssetDto =
  z.infer<typeof updateAssetSchema>;