import type { TicketListParams } from "../types/ticket.types";

/**
 * Hierarchical query keys for tickets
 * 
 * Structure:
 * - ticketKeys.all: Invalidates everything
 * - ticketKeys.lists(): Invalidates all lists
 * - ticketKeys.list(params): Specific list with filters
 * - ticketKeys.details(): Invalidates all details
 * - ticketKeys.detail(id): Specific ticket detail
 */
export const ticketKeys = {
  all: ["tickets"] as const,
  
  lists: () => [...ticketKeys.all, "list"] as const,
  
  list: (params: TicketListParams) =>
    [...ticketKeys.lists(), params] as const,
  
  details: () => [...ticketKeys.all, "detail"] as const,
  
  detail: (id: string) => [...ticketKeys.details(), id] as const,
};
