function formatTicketNumber(
  number: number
) {
  return `TKT-${number
    .toString()
    .padStart(6, "0")}`;
}

export function toTicketResponse(
  ticket: any
) {
  return {
    id: ticket.id,

    number: formatTicketNumber(
      ticket.ticketNumber
    ),

    title: ticket.title,

    description: ticket.description,

    priority: ticket.priority,

    status: ticket.status,

    requester: ticket.requester
      ? {
          id: ticket.requester.id,
          firstName:
            ticket.requester.firstName,
          lastName:
            ticket.requester.lastName,
          email:
            ticket.requester.email,
        }
      : null,

    category: ticket.category
      ? {
          id: ticket.category.id,
          name: ticket.category.name,
        }
      : null,

    asset: ticket.asset
      ? {
          id: ticket.asset.id,
          name: ticket.asset.name,
          assetTag:
            ticket.asset.assetTag,
        }
      : null,

    assignedTo: ticket.assignedTo
      ? {
          id: ticket.assignedTo.id,
          firstName:
            ticket.assignedTo.firstName,
          lastName:
            ticket.assignedTo.lastName,
        }
      : null,

    createdBy: {
      id: ticket.createdBy.id,
      firstName:
        ticket.createdBy.firstName,
      lastName:
        ticket.createdBy.lastName,
    },

    createdAt: ticket.createdAt,

    updatedAt: ticket.updatedAt,
  };
}

export function toTicketsResponse(
  tickets: any[]
) {
  return tickets.map(
    toTicketResponse
  );
}