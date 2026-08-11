import type {
  Notification,
} from "../../../generated/prisma/client.js";
import { buildMeta } from "../../../lib/pagination.js";
import type { PaginatedResponse } from "../../../lib/pagination.js";

export function toNotificationResponse(
  notification: Notification
) {
  return {
    id: notification.id,

    title: notification.title,

    message: notification.message,

    isRead: notification.isRead,

    userId: notification.userId,

    createdAt:
      notification.createdAt,
  };
}

export function toNotificationsResponse(
  notifications: Notification[]
) {
  return notifications.map(
    toNotificationResponse
  );
}

export function toNotificationsListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: Notification[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof toNotificationResponse>> {
  return {
    data: items.map(toNotificationResponse),
    meta: buildMeta(total, page, pageSize),
  };
}