// Types
export type {
  Ticket,
  TicketStatus,
  CreateTicketInput,
  UpdateTicketInput,
  AssignTicketInput,
  UpdateTicketStatusInput,
  TicketListParams,
  TicketsResponse,
} from "./types/ticket.types";

// API
export * from "./api/ticket.api";
export { ticketKeys } from "./api/ticket.queryKeys";

// Hooks
export { useTickets } from "./hooks/useTickets";
export { useTicket } from "./hooks/useTicket";
export { useCreateTicket } from "./hooks/useCreateTicket";
export { useUpdateTicket } from "./hooks/useUpdateTicket";
export { useAssignTicket } from "./hooks/useAssignTicket";
export { useUpdateTicketStatus } from "./hooks/useUpdateTicketStatus";
export { useDeleteTicket } from "./hooks/useDeleteTicket";

// Components
export { TicketsTable } from "./components/TicketsTable";
export { TicketForm } from "./components/TicketForm";

// Pages
export { default as TicketsListPage } from "./pages/TicketsListPage";
export { default as CreateTicketPage } from "./pages/CreateTicketPage";
export { default as TicketDetailPage } from "./pages/TicketDetailPage";
