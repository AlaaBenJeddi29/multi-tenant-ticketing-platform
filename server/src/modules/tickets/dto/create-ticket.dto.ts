import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(3).max(150),

  description: z.string().optional(),

  priorityId: z.string().cuid(),

  categoryId: z.string().cuid(),

  requesterId: z.string().cuid(),

  assetId: z.string().cuid().optional(),

  assignedToId: z.string().cuid().optional(),
});

export type CreateTicketDto =
  z.infer<typeof createTicketSchema>;