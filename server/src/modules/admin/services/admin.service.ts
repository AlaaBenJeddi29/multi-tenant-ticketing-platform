import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../lib/AppError.js";
import { getSkipTake } from "../../../lib/pagination.js";

export async function getPlatformDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalOrganizations,
    activeOrganizations,
    totalUsers,
    activeUsers,
    totalTickets,
    ticketsCreatedToday,
    ticketsResolvedToday,
    slaBreachedTickets,
    ticketVolumeByDay,
    topOrganizationsByTickets,
    newOrganizationsThisMonth,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.organization.count({
      where: {
        users: {
          some: {
            isActive: true,
          },
        },
      },
    }),
    prisma.user.count(),
    prisma.user.count({
      where: {
        isActive: true,
      },
    }),
    prisma.ticket.count(),
    prisma.ticket.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    }),
    prisma.ticket.count({
      where: {
        resolvedAt: {
          gte: today,
        },
      },
    }),
    prisma.ticket.count({
      where: {
        OR: [
          { responseBreached: true },
          { resolutionBreached: true },
        ],
      },
    }),
    // Ticket volume by day for last 30 days
    prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Ticket"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `,
    // Top 5 organizations by ticket count
    prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            tickets: true,
          },
        },
      },
      orderBy: {
        tickets: {
          _count: "desc",
        },
      },
      take: 5,
    }),
    // New organizations this month
    prisma.organization.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
  ]);

  const slaBreachRate =
    totalTickets > 0
      ? Number(((slaBreachedTickets / totalTickets) * 100).toFixed(1))
      : 0;

  const ticketVolumeByDayFormatted = ticketVolumeByDay.map((item: any) => ({
    date: item.date,
    count: Number(item.count),
  }));

  const topOrganizationsByTicketsFormatted = topOrganizationsByTickets.map(
    (org: any) => ({
      id: org.id,
      name: org.name,
      ticketCount: org._count.tickets,
    })
  );

  return {
    totalOrganizations,
    activeOrganizations,
    totalUsers,
    activeUsers,
    totalTickets,
    ticketsCreatedToday,
    ticketsResolvedToday,
    slaBreachRate,
    ticketVolumeByDay: ticketVolumeByDayFormatted,
    topOrganizationsByTickets: topOrganizationsByTicketsFormatted,
    newOrganizationsThisMonth,
  };
}

export async function getAllOrganizations(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const { skip, take } = getSkipTake(params.page, params.pageSize);

  const where = params.search
    ? {
        OR: [
          { name: { contains: params.search, mode: "insensitive" as const } },
          { slug: { contains: params.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
            tickets: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.organization.count({ where }),
  ]);

  const itemsWithCounts = await Promise.all(
    items.map(async (org) => {
      const activeUserCount = await prisma.user.count({
        where: {
          organizationId: org.id,
          isActive: true,
        },
      });

      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        createdAt: org.createdAt,
        userCount: org._count.users,
        ticketCount: org._count.tickets,
        activeUserCount,
        status: activeUserCount > 0 ? "ACTIVE" : "INACTIVE",
      };
    })
  );

  return {
    data: itemsWithCounts,
    total,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function getOrganizationById(id: string) {
  const organization = await prisma.organization.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          users: true,
          tickets: true,
        },
      },
    },
  });

  if (!organization) {
    throw new AppError(404, "Organization not found");
  }

  const [activeUserCount, openTickets, resolvedTickets, slaBreaches, recentTickets, users] =
    await Promise.all([
      prisma.user.count({
        where: {
          organizationId: id,
          isActive: true,
        },
      }),
      prisma.ticket.count({
        where: {
          organizationId: id,
          status: {
            in: ["NEW", "IN_PROGRESS"],
          },
        },
      }),
      prisma.ticket.count({
        where: {
          organizationId: id,
          status: {
            in: ["RESOLVED", "CLOSED"],
          },
        },
      }),
      prisma.ticket.count({
        where: {
          organizationId: id,
          OR: [
            { responseBreached: true },
            { resolutionBreached: true },
          ],
        },
      }),
      prisma.ticket.findMany({
        where: {
          organizationId: id,
        },
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: {
          organizationId: id,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
    userCount: organization._count.users,
    ticketCount: organization._count.tickets,
    activeUserCount,
    openTickets,
    resolvedTickets,
    slaBreaches,
    recentTickets,
    users,
  };
}

export async function suspendOrganization(id: string) {
  const organization = await prisma.organization.findUnique({
    where: { id },
  });

  if (!organization) {
    throw new AppError(404, "Organization not found");
  }

  await prisma.user.updateMany({
    where: {
      organizationId: id,
    },
    data: {
      isActive: false,
    },
  });

  return { message: "Organization suspended successfully" };
}

export async function activateOrganization(id: string) {
  const organization = await prisma.organization.findUnique({
    where: { id },
  });

  if (!organization) {
    throw new AppError(404, "Organization not found");
  }

  await prisma.user.updateMany({
    where: {
      organizationId: id,
    },
    data: {
      isActive: true,
    },
  });

  return { message: "Organization activated successfully" };
}

export async function getAllUsers(params: {
  page: number;
  pageSize: number;
  search?: string;
  organizationId?: string;
  role?: string;
}) {
  const { skip, take } = getSkipTake(params.page, params.pageSize);

  const where: any = {};

  if (params.search) {
    where.OR = [
      { firstName: { contains: params.search, mode: "insensitive" } },
      { lastName: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.organizationId) {
    where.organizationId = params.organizationId;
  }

  if (params.role) {
    where.role = params.role;
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: items,
    total,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  return { message: `User ${isActive ? "activated" : "deactivated"} successfully` };
}
