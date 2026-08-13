import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../api/notification.api";
import { notificationKeys } from "../api/notification.queryKeys";

/**
 * Hook to mark a notification as read
 * Invalidates both the notification list and unread count on success
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate notification lists and unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}
