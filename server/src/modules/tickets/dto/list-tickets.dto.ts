import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";
import { TicketStatus } from "../../../generated/prisma/client.js";

export const listTicketsQuerySchema = paginationQuerySchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  status: z
    .nativeEnum(TicketStatus)
    .optional(),

  priorityId: z
    .string()
    .trim()
    .optional(),

  categoryId: z
    .string()
    .trim()
    .optional(),

  assignedToId: z
    .string()
    .trim()
    .optional(),

  requesterId: z
    .string()
    .trim()
    .optional(),

  sortBy: z
    .enum([
      "createdAt",
      "updatedAt",
      "ticketNumber",
      "responseDueAt",
      "resolutionDueAt",
    ])
    .default("createdAt"),
});

export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;
