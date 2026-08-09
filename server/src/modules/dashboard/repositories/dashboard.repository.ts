import { prisma } from "../../../lib/prisma.js";

export async function getDashboardOverview(
  organizationId: string
) {
  const [
    totalTickets,
    newTickets,
    inProgressTickets,
    waitingRequesterTickets,
    resolvedTickets,
    closedTickets,
    responseBreachedTickets,
    resolutionBreachedTickets,
    unassignedTickets,
    priorityDistribution,
    categoryDistribution,
    agentWorkload,
  ] = await Promise.all([
    /*
     * Total tickets
     */
    prisma.ticket.count({
      where: {
        organizationId,
      },
    }),

    /*
     * Tickets by status
     */
    prisma.ticket.count({
      where: {
        organizationId,
        status: "NEW",
      },
    }),

    prisma.ticket.count({
      where: {
        organizationId,
        status: "IN_PROGRESS",
      },
    }),

    prisma.ticket.count({
      where: {
        organizationId,
        status: "WAITING_REQUESTER",
      },
    }),

    prisma.ticket.count({
      where: {
        organizationId,
        status: "RESOLVED",
      },
    }),

    prisma.ticket.count({
      where: {
        organizationId,
        status: "CLOSED",
      },
    }),

    /*
     * SLA breaches
     */
    prisma.ticket.count({
      where: {
        organizationId,
        responseBreached: true,
      },
    }),

    prisma.ticket.count({
      where: {
        organizationId,
        resolutionBreached: true,
      },
    }),

    /*
     * Unassigned tickets
     */
    prisma.ticket.count({
      where: {
        organizationId,
        assignedToId: null,
      },
    }),

    /*
     * Tickets by priority
     */
    prisma.ticket.groupBy({
      by: ["priorityId"],
      where: {
        organizationId,
      },
      _count: {
        _all: true,
      },
    }),

    /*
     * Tickets by category
     */
    prisma.ticket.groupBy({
      by: ["categoryId"],
      where: {
        organizationId,
      },
      _count: {
        _all: true,
      },
    }),

    /*
     * Tickets assigned to agents
     */
    prisma.ticket.groupBy({
      by: ["assignedToId"],
      where: {
        organizationId,
        assignedToId: {
          not: null,
        },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  /*
   * Resolve priority names.
   */
  const priorities = await prisma.priority.findMany({
    where: {
      organizationId,
      id: {
        in: priorityDistribution.map(
          (item) => item.priorityId
        ),
      },
    },
    select: {
      id: true,
      name: true,
      level: true,
      color: true,
    },
  });

  /*
   * Resolve category names.
   */
  const categories = await prisma.category.findMany({
    where: {
      organizationId,
      id: {
        in: categoryDistribution.map(
          (item) => item.categoryId
        ),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  /*
   * Resolve agent names.
   */
  const agents = await prisma.user.findMany({
    where: {
      organizationId,
      id: {
        in: agentWorkload
          .map((item) => item.assignedToId)
          .filter(
            (id): id is string => id !== null
          ),
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  return {
    totalTickets,

    ticketsByStatus: {
      NEW: newTickets,
      IN_PROGRESS: inProgressTickets,
      WAITING_REQUESTER: waitingRequesterTickets,
      RESOLVED: resolvedTickets,
      CLOSED: closedTickets,
    },

    sla: {
      responseBreached: responseBreachedTickets,
      resolutionBreached: resolutionBreachedTickets,
    },

    unassignedTickets,

    priorityDistribution,

    categoryDistribution,

    agentWorkload,

    priorities,

    categories,

    agents,
  };
}