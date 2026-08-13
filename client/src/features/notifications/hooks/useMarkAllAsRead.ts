import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../api/notification.api";
import { notificationKeys } from "../api/notification.queryKeys";

/**
 * Hook to mark all notifications as read
 * Invalidates both the notification list and unread count on success
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate notification lists and unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}
