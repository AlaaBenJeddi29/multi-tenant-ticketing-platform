import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../api/notification.api";
import { notificationKeys } from "../api/notification.queryKeys";

/**
 * Hook to delete a notification
 * Invalidates both the notification list and unread count on success
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate notification lists and unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}
