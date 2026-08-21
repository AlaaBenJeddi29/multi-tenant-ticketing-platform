import type { Notification } from "../types/notification.types";

/**
 * Get the navigation path for a notification based on its related entity
 */
export function getNotificationPath(notification: Notification): string | null {
  if (!notification.relatedEntityType || !notification.relatedEntityId) {
    return null;
  }

  switch (notification.relatedEntityType) {
    case "TICKET":
      return `/tickets/${notification.relatedEntityId}`;
    // Add more entity types as needed
    // case "USER":
    //   return `/users/${notification.relatedEntityId}`;
    // case "ASSET":
    //   return `/assets/${notification.relatedEntityId}`;
    default:
      return null;
  }
}
