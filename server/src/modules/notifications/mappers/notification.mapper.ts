import type {
  Notification,
} from "../../../generated/prisma/client.js";

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