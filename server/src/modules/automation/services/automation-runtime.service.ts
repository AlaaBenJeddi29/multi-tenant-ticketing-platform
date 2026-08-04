import { prisma } from "../../../lib/prisma.js";

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

  const responseBreached =
    await prisma.ticket.updateMany({
      where: {
        status: "NEW",

        firstRespondedAt: null,

        responseBreached: false,

        responseDueAt: {
          lt: now,
        },
      },

      data: {
        responseBreached: true,
      },
    });

  const resolutionBreached =
    await prisma.ticket.updateMany({
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

      data: {
        resolutionBreached: true,
      },
    });

  return {
    responseBreaches:
      responseBreached.count,

    resolutionBreaches:
      resolutionBreached.count,
  };
}