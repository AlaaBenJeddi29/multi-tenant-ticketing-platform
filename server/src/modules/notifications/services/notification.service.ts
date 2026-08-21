import { AppError } from "../../../lib/AppError.js";

import type {
  CreateNotificationDto,
} from "../dto/create-notification.dto.js";

import type {
  UpdateNotificationDto,
} from "../dto/update-notification.dto.js";

import type {
  ListNotificationsQuery,
} from "../dto/list-notifications.dto.js";

import {
  countUnreadNotifications,
  createNotification,
  deleteNotification,
  findNotificationById,
  findNotifications,
  markAllNotificationsAsRead,
  updateNotification,
} from "../repositories/notification.repository.js";

import {
  toNotificationResponse,
  toNotificationsListResponse,
} from "../mappers/notification.mapper.js";

export async function getNotifications(
  userId: string,
  query: ListNotificationsQuery
) {
  const { items, total } =
    await findNotifications(userId, query);

  return toNotificationsListResponse({
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
  });
}

export async function getNotificationById(
  id: string,
  userId: string
) {
  const notification =
    await findNotificationById(
      id,
      userId
    );

  if (!notification) {
    throw new AppError(
      404,
      "Notification not found."
    );
  }

  return toNotificationResponse(
    notification
  );
}

export async function createNewNotification(
  dto: CreateNotificationDto
) {
  const notification =
    await createNotification({
      title: dto.title,

      message: dto.message,

      user: {
        connect: {
          id: dto.userId,
        },
      },

      ...(dto.relatedEntityType && {
        relatedEntityType: dto.relatedEntityType,
      }),

      ...(dto.relatedEntityId && {
        relatedEntityId: dto.relatedEntityId,
      }),
    });

  return toNotificationResponse(
    notification
  );
}

export async function markNotificationAsRead(
  id: string,
  userId: string,
  dto: UpdateNotificationDto
) {
  await getNotificationById(
    id,
    userId
  );

  const notification =
    await updateNotification(id, {
      isRead: dto.isRead,
    });

  return toNotificationResponse(
    notification
  );
}

export async function markAllAsRead(
  userId: string
) {
  await markAllNotificationsAsRead(
    userId
  );

  return {
    message:
      "All notifications marked as read.",
  };
}

export async function getUnreadCount(
  userId: string
) {
  const count =
    await countUnreadNotifications(
      userId
    );

  return {
    unread: count,
  };
}

export async function removeNotification(
  id: string,
  userId: string
) {
  await getNotificationById(
    id,
    userId
  );

  await deleteNotification(id);
}