import { prisma } from "../../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export function findTickets(
  organizationId: string
) {
  return prisma.ticket.findMany({
    where: {
      organizationId,
    },

    include: {
      category: true,
      requester: true,
      asset: true,
      assignedTo: true,
      createdBy: true,
    },

    orderBy: {
      createdAt: "desc",
    },
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

    include: {
      category: true,
      requester: true,
      asset: true,
      assignedTo: true,
      createdBy: true,
    },
  });
}

export async function findNextTicketNumber() {
  const ticket = await prisma.ticket.findFirst({
    orderBy: {
      ticketNumber: "desc",
    },

    select: {
      ticketNumber: true,
    },
  });

  return (ticket?.ticketNumber ?? 0) + 1;
}

export function findRequester(
  requesterId: string,
  organizationId: string
) {
  return prisma.requester.findFirst({
    where: {
      id: requesterId,
      organizationId,
    },
  });
}

export function findCategory(
  categoryId: string,
  organizationId: string
) {
  return prisma.category.findFirst({
    where: {
      id: categoryId,
      organizationId,
    },
  });
}

export function findAsset(
  assetId: string,
  organizationId: string
) {
  return prisma.asset.findFirst({
    where: {
      id: assetId,
      organizationId,
    },
  });
}

export function findOrganizationUser(
  userId: string,
  organizationId: string
) {
  return prisma.user.findFirst({
    where: {
      id: userId,
      organizationId,
    },
  });
}

export function createTicket(
  data: Prisma.TicketCreateInput
) {
  return prisma.ticket.create({
    data,

    include: {
      category: true,
      requester: true,
      asset: true,
      assignedTo: true,
      createdBy: true,
    },
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

    include: {
      category: true,
      requester: true,
      asset: true,
      assignedTo: true,
      createdBy: true,
    },
  });
}

export function deleteTicket(
  id: string
) {
  return prisma.ticket.delete({
    where: {
      id,
    },
  });
}