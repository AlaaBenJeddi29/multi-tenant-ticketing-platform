import { z } from "zod";

export const assignTicketSchema =
  z.object({
    assignedToId: z.string(),
  });

export type AssignTicketDto =
  z.infer<
    typeof assignTicketSchema
  >;