import { z } from "zod";

export const createAssetSchema = z.object({
  name: z.string().trim().min(2).max(100),

  assetTag: z.string().trim().min(2).max(50),

  manufacturer: z.string().trim().optional(),

  model: z.string().trim().optional(),

  serialNumber: z.string().trim().optional(),

  purchaseDate: z.coerce.date().optional(),

  warrantyUntil: z.coerce.date().optional(),

  location: z.string().trim().optional(),

  notes: z.string().trim().optional(),
});

export type CreateAssetDto =
  z.infer<typeof createAssetSchema>;