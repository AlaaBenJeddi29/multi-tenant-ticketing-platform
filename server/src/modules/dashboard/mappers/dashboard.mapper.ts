type DashboardRepositoryResult = {
  totalTickets: number;

  ticketsByStatus: {
    NEW: number;
    IN_PROGRESS: number;
    WAITING_REQUESTER: number;
    RESOLVED: number;
    CLOSED: number;
  };

  sla: {
    responseBreached: number;
    resolutionBreached: number;
  };

  unassignedTickets: number;

  priorityDistribution: Array<{
    priorityId: string;
    _count: {
      _all: number;
    };
  }>;

  categoryDistribution: Array<{
    categoryId: string;
    _count: {
      _all: number;
    };
  }>;

  agentWorkload: Array<{
    assignedToId: string | null;
    _count: {
      _all: number;
    };
  }>;

  priorities: Array<{
    id: string;
    name: string;
    level: string;
    color: string;
  }>;

  categories: Array<{
    id: string;
    name: string;
  }>;

  agents: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
};

export function toDashboardOverviewResponse(
  data: DashboardRepositoryResult
) {
  const priorityMap = new Map(
    data.priorities.map((priority) => [
      priority.id,
      priority,
    ])
  );

  const categoryMap = new Map(
    data.categories.map((category) => [
      category.id,
      category,
    ])
  );

  const agentMap = new Map(
    data.agents.map((agent) => [
      agent.id,
      agent,
    ])
  );

  return {
    summary: {
      totalTickets: data.totalTickets,

      newTickets:
        data.ticketsByStatus.NEW,

      inProgressTickets:
        data.ticketsByStatus.IN_PROGRESS,

      waitingRequesterTickets:
        data.ticketsByStatus.WAITING_REQUESTER,

      resolvedTickets:
        data.ticketsByStatus.RESOLVED,

      closedTickets:
        data.ticketsByStatus.CLOSED,

      unassignedTickets:
        data.unassignedTickets,
    },

    sla: {
      responseBreached:
        data.sla.responseBreached,

      resolutionBreached:
        data.sla.resolutionBreached,
    },

    statusDistribution: [
      {
        status: "NEW",
        count: data.ticketsByStatus.NEW,
      },
      {
        status: "IN_PROGRESS",
        count:
          data.ticketsByStatus.IN_PROGRESS,
      },
      {
        status: "WAITING_REQUESTER",
        count:
          data.ticketsByStatus.WAITING_REQUESTER,
      },
      {
        status: "RESOLVED",
        count:
          data.ticketsByStatus.RESOLVED,
      },
      {
        status: "CLOSED",
        count:
          data.ticketsByStatus.CLOSED,
      },
    ],

    priorityDistribution:
      data.priorityDistribution.map(
        (item) => {
          const priority =
            priorityMap.get(
              item.priorityId
            );

          return {
            priorityId:
              item.priorityId,

            name:
              priority?.name ??
              "Unknown",

            level:
              priority?.level ??
              "UNKNOWN",

            color:
              priority?.color ??
              null,

            count:
              item._count._all,
          };
        }
      ),

    categoryDistribution:
      data.categoryDistribution.map(
        (item) => {
          const category =
            categoryMap.get(
              item.categoryId
            );

          return {
            categoryId:
              item.categoryId,

            name:
              category?.name ??
              "Unknown",

            count:
              item._count._all,
          };
        }
      ),

    agentWorkload:
      data.agentWorkload.map(
        (item) => {
          const agent =
            item.assignedToId
              ? agentMap.get(
                  item.assignedToId
                )
              : undefined;

          return {
            agentId:
              item.assignedToId,

            agentName: agent
              ? `${agent.firstName} ${agent.lastName}`
              : "Unknown",

            ticketCount:
              item._count._all,
          };
        }
      ),
  };
}