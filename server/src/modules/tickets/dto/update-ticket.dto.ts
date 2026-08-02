import { z } from "zod";

export const updateTicketSchema =
  z.object({
    title:
      z.string().min(5).optional(),

    description:
      z
        .string()
        .min(10)
        .optional(),

    categoryId:
      z.string().optional(),

    assetId:
      z.string().nullable().optional(),

    priority: z
      .enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ])
      .optional(),
  });

export type UpdateTicketDto =
  z.infer<
    typeof updateTicketSchema
  >;