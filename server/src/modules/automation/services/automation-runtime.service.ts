import { prisma } from "../../../lib/prisma.js";
import { executeAutomationRules } from "./automation-engine.service.js";

export function calculateSlaDeadlines(
  responseTimeMinutes: number,
  resolutionTimeMinutes: number
) {
  const now = new Date();

  return {
    responseDueAt: new Date(
      now.getTime() +
        responseTimeMinutes *
          60 *
          1000
    ),

    resolutionDueAt: new Date(
      now.getTime() +
        resolutionTimeMinutes *
          60 *
          1000
    ),
  };
}

export async function processFirstResponse(
  ticketId: string,
  responseDueAt: Date,
  firstRespondedAt: Date | null
) {
  if (firstRespondedAt) {
    return;
  }

  const now = new Date();

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },

    data: {
      firstRespondedAt: now,

      responseBreached:
        now > responseDueAt,
    },
  });
}

export async function processResolution(
  ticketId: string,
  resolutionDueAt: Date,
  resolvedAt: Date | null
) {
  if (resolvedAt) {
    return;
  }

  const now = new Date();

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },

    data: {
      resolvedAt: now,

      resolutionBreached:
        now > resolutionDueAt,
    },
  });
}

export async function processSlaAutomation() {
  const now = new Date();

  /*
   * Response breaches
   */

  const responseTickets =
    await prisma.ticket.findMany({
      where: {
        status: "NEW",

        firstRespondedAt: null,

        responseBreached: false,

        responseDueAt: {
          lt: now,
        },
      },

      select: {
        id: true,
      },
    });

  for (const ticket of responseTickets) {
    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },

      data: {
        responseBreached: true,
      },
    });

    await executeAutomationRules(
      ticket.id,
      "SLA_BREACHED"
    );
  }

  /*
   * Resolution breaches
   */

  const resolutionTickets =
    await prisma.ticket.findMany({
      where: {
        status: {
          notIn: [
            "RESOLVED",
            "CLOSED",
          ],
        },

        resolutionBreached: false,

        resolutionDueAt: {
          lt: now,
        },
      },

      select: {
        id: true,
      },
    });

  for (const ticket of resolutionTickets) {
    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },

      data: {
        resolutionBreached: true,
      },
    });

    await executeAutomationRules(
      ticket.id,
      "SLA_BREACHED"
    );
  }

  return {
    responseBreaches:
      responseTickets.length,

    resolutionBreaches:
      resolutionTickets.length,
  };
}