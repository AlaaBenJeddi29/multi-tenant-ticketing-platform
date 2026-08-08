import { prisma } from "../../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";

export async function findNotifications(
  userId: string
) {
  return prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
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