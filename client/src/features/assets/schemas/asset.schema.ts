import { z } from "zod";

export const assetFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  assetTag: z
    .string()
    .min(2, "Asset tag must be at least 2 characters")
    .max(50, "Asset tag must not exceed 50 characters")
    .trim(),

  manufacturer: z
    .string()
    .max(100, "Manufacturer must not exceed 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  model: z
    .string()
    .max(100, "Model must not exceed 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  serialNumber: z
    .string()
    .max(100, "Serial number must not exceed 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  purchaseDate: z
    .string()
    .optional()
    .or(z.literal("")),

  warrantyUntil: z
    .string()
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .max(200, "Location must not exceed 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  notes: z
    .string()
    .max(1000, "Notes must not exceed 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  status: z
    .enum(["ACTIVE", "IN_MAINTENANCE", "RETIRED"])
    .optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
