import { useQuery } from "@tanstack/react-query";
import { getTicketById } from "../api/ticket.api";
import { ticketKeys } from "../api/ticket.queryKeys";

/**
 * Hook to fetch a single ticket by ID
 */
export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => getTicketById(id),
    enabled: !!id,
  });
}
