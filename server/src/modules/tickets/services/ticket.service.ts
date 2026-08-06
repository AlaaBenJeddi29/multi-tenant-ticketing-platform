import { AppError } from "../../../lib/AppError.js";

import type { Prisma } from "../../../generated/prisma/client.js";

import type { CreateTicketDto } from "../dto/create-ticket.dto.js";

import type { UpdateTicketDto } from "../dto/update-ticket.dto.js";

import type { AssignTicketDto } from "../dto/assign-ticket.dto.js";

import type { UpdateTicketStatusDto } from "../dto/update-ticket-status.dto.js";

import { findActiveSlaByPriority } from "../../sla/repositories/sla.repository.js";

import {
  calculateSlaDeadlines,
  processResolution,
} from "../../automation/services/automation-runtime.service.js";

import { executeAutomationRules } from "../../automation/services/automation-engine.service.js";

import {
  createTicket,
  deleteTicket,
  findTicketById,
  findTickets,
  getLastTicketNumber,
  updateTicket,
} from "../repositories/ticket.repository.js";

import {
  toTicketResponse,
  toTicketsResponse,
} from "../mappers/ticket.mapper.js";

export async function getTickets(organizationId: string) {
  const tickets = await findTickets(organizationId);

  return toTicketsResponse(tickets);
}

export async function getTicketById(id: string, organizationId: string) {
  const ticket = await findTicketById(id, organizationId);

  if (!ticket) {
    throw new AppError(404, "Ticket not found.");
  }

  return toTicketResponse(ticket);
}

export async function createNewTicket(
  dto: CreateTicketDto,
  organizationId: string,
  createdById: string
) {
  const lastTicket = await getLastTicketNumber(organizationId);

  const nextTicketNumber = (lastTicket?.ticketNumber ?? 0) + 1;

  const sla = await findActiveSlaByPriority(dto.priorityId, organizationId);

  if (!sla) {
    throw new AppError(
      400,
      "No active SLA found for the selected priority."
    );
  }

  const { responseDueAt, resolutionDueAt } = calculateSlaDeadlines(
    sla.responseTimeMinutes,
    sla.resolutionTimeMinutes
  );

  const ticket = await createTicket({
    ticketNumber: nextTicketNumber,

    title: dto.title,

    description: dto.description,

    responseDueAt,

    resolutionDueAt,

    organization: {
      connect: {
        id: organizationId,
      },
    },

    priority: {
      connect: {
        id: dto.priorityId,
      },
    },

    category: {
      connect: {
        id: dto.categoryId,
      },
    },

    requester: {
      connect: {
        id: dto.requesterId,
      },
    },

    createdBy: {
      connect: {
        id: createdById,
      },
    },

    ...(dto.assetId && {
      asset: {
        connect: {
          id: dto.assetId,
        },
      },
    }),

    ...(dto.assignedToId && {
      assignedTo: {
        connect: {
          id: dto.assignedToId,
        },
      },
    }),
  });

  await executeAutomationRules(ticket.id, "TICKET_CREATED");

  return toTicketResponse(ticket);
}

export async function editTicket(
  id: string,
  organizationId: string,
  dto: UpdateTicketDto
) {
  await getTicketById(id, organizationId);

  const data: Prisma.TicketUpdateInput = {};

  if (dto.title !== undefined) {
    data.title = dto.title;
  }

  if (dto.description !== undefined) {
    data.description = dto.description;
  }

  if (dto.priorityId !== undefined) {
    data.priority = {
      connect: {
        id: dto.priorityId,
      },
    };
  }

  if (dto.categoryId !== undefined) {
    data.category = {
      connect: {
        id: dto.categoryId,
      },
    };
  }

  if (dto.requesterId !== undefined) {
    data.requester = {
      connect: {
        id: dto.requesterId,
      },
    };
  }

  if (dto.assetId !== undefined) {
    data.asset = dto.assetId
      ? {
          connect: {
            id: dto.assetId,
          },
        }
      : {
          disconnect: true,
        };
  }

  if (dto.assignedToId !== undefined) {
    data.assignedTo = dto.assignedToId
      ? {
          connect: {
            id: dto.assignedToId,
          },
        }
      : {
          disconnect: true,
        };
  }

  const ticket = await updateTicket(id, data);

  await executeAutomationRules(id, "TICKET_UPDATED");

  return toTicketResponse(ticket);
}

export async function assignTicket(
  id: string,
  organizationId: string,
  dto: AssignTicketDto
) {
  await getTicketById(id, organizationId);

  const ticket = await updateTicket(id, {
    assignedTo: {
      connect: {
        id: dto.assignedToId,
      },
    },
  });

  return toTicketResponse(ticket);
}

export async function updateStatus(
  id: string,
  organizationId: string,
  dto: UpdateTicketStatusDto
) {
  const existing = await findTicketById(id, organizationId);

  if (!existing) {
    throw new AppError(404, "Ticket not found.");
  }

  await updateTicket(id, {
    status: dto.status,
  });

  if (dto.status === "RESOLVED") {
    await processResolution(
      existing.id,
      existing.resolutionDueAt,
      existing.resolvedAt
    );
  }

  await executeAutomationRules(id, "STATUS_CHANGED");

  const updated = await findTicketById(id, organizationId);

  if (!updated) {
    throw new AppError(404, "Ticket not found.");
  }

  return toTicketResponse(updated);
}

export async function removeTicket(id: string, organizationId: string) {
  await getTicketById(id, organizationId);

  await deleteTicket(id);
}