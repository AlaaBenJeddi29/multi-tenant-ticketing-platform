import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../api/ticket.api";
import { ticketKeys } from "../api/ticket.queryKeys";
import type { TicketListParams } from "../types/ticket.types";

/**
 * Hook to fetch paginated list of tickets
 * Uses placeholderData to prevent loading flash during pagination
 */
export function useTickets(params: TicketListParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => getTickets(params),
    placeholderData: (previousData) => previousData,
  });
}
