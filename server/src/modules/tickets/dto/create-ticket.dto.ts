import { z } from "zod";

export const createTicketSchema =
  z.object({
    title: z.string().min(5),

    description: z.string().min(10),

    requesterId: z.string(),

    categoryId: z.string(),

    assetId:
      z.string().optional(),

    priority: z.enum([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ]),
  });

export type CreateTicketDto =
  z.infer<
    typeof createTicketSchema
  >;