import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";

import { getSkipTake } from "../../../lib/pagination.js";
import type { ListNotificationsQuery } from "../dto/list-notifications.dto.js";

export async function findNotifications(
  userId: string,
  query: ListNotificationsQuery
) {
  const where: Prisma.NotificationWhereInput = {
    userId,
  };

  // Apply isRead filter
  if (query.isRead !== undefined) {
    where.isRead = query.isRead;
  }

  // sortBy and sortOrder are fixed to createdAt desc for notifications
  const orderBy: Prisma.NotificationOrderByWithRelationInput = {
    createdAt: "desc",
  };

  // Calculate pagination
  const { skip, take } = getSkipTake(query.page, query.pageSize);

  // Execute queries in parallel
  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.notification.count({ where }),
  ]);

  return { items, total };
}

export async function findNotificationById(
  id: string,
  userId: string
) {
  return prisma.notification.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function createNotification(
  data: Prisma.NotificationCreateInput
) {
  return prisma.notification.create({
    data,
  });
}

export async function updateNotification(
  id: string,
  data: Prisma.NotificationUpdateInput
) {
  return prisma.notification.update({
    where: {
      id,
    },

    data,
  });
}

export async function deleteNotification(
  id: string
) {
  return prisma.notification.delete({
    where: {
      id,
    },
  });
}

export async function markAllNotificationsAsRead(
  userId: string
) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },

    data: {
      isRead: true,
    },
  });
}

export async function countUnreadNotifications(
  userId: string
) {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}