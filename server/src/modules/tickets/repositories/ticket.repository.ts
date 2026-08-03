import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";
const ticketSelect = {
  id: true,

  ticketNumber: true,

  title: true,

  description: true,

  status: true,

  responseDueAt: true,

  resolutionDueAt: true,

  firstRespondedAt: true,

  resolvedAt: true,

  responseBreached: true,

  resolutionBreached: true,

  createdAt: true,

  updatedAt: true,

  priority: true,

  category: true,

  requester: true,

  asset: true,
comments: {
  orderBy: {
    createdAt: "asc",
  },

  select: {
    id: true,

    content: true,

    createdAt: true,

    author: {
      select: {
        id: true,

        firstName: true,

        lastName: true,
      },
    },
  },
},
  assignedTo: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.TicketSelect;

export function findTickets(
  organizationId: string
) {
  return prisma.ticket.findMany({
    where: {
      organizationId,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: ticketSelect,
  });
}

export function findTicketById(
  id: string,
  organizationId: string
) {
  return prisma.ticket.findFirst({
    where: {
      id,
      organizationId,
    },

    select: ticketSelect,
  });
}

export function createTicket(
  data: Prisma.TicketCreateInput
) {
  return prisma.ticket.create({
    data,

    select: ticketSelect,
  });
}

export function updateTicket(
  id: string,
  data: Prisma.TicketUpdateInput
) {
  return prisma.ticket.update({
    where: {
      id,
    },

    data,

    select: ticketSelect,
  });
}

export function deleteTicket(
  id: string
) {
  return prisma.ticket.delete({
    where: {
      id,
    },

    select: {
      id: true,
    },
  });
}

export function getLastTicketNumber(
  organizationId: string
) {
  return prisma.ticket.findFirst({
    where: {
      organizationId,
    },

    orderBy: {
      ticketNumber: "desc",
    },

    select: {
      ticketNumber: true,
    },
  });
}