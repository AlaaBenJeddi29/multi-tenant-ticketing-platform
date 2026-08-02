import { z } from "zod";

export const updateTicketStatusSchema =
  z.object({
    status: z.enum([
      "NEW",
      "IN_PROGRESS",
      "WAITING_REQUESTER",
      "RESOLVED",
      "CLOSED",
    ]),
  });

export type UpdateTicketStatusDto =
  z.infer<
    typeof updateTicketStatusSchema
  >;