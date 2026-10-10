# Notifications Feature Implementation

## Overview
Complete implementation of the notifications feature following the established conventions, including a notification bell in the sidebar and a full notifications page.

## API Endpoints

The feature consumes the following backend endpoints:

- `GET /api/notifications?page&pageSize&isRead` - Paginated list of user's notifications
- `GET /api/notifications/unread` - Get unread notification count
- `PATCH /api/notifications/:id/read` - Mark a single notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification

Note: All endpoints are scoped server-side by `userId`, not `organizationId`.

## Feature Structure

```
client/src/features/notifications/
├── api/
│   ├── notification.api.ts        # API client functions
│   └── notification.queryKeys.ts  # React Query key factory
├── components/
│   └── NotificationBell.tsx       # Bell icon with dropdown
├── hooks/
│   ├── useUnreadCount.ts          # Hook for unread count (30s refetch)
│   ├── useNotifications.ts        # Hook for paginated notifications
│   ├── useMarkAsRead.ts           # Hook to mark single as read
│   ├── useMarkAllAsRead.ts        # Hook to mark all as read
│   └── useDeleteNotification.ts   # Hook to delete notification
├── pages/
│   └── NotificationsPage.tsx      # Full notifications page
├── types/
│   └── notification.types.ts      # TypeScript types
└── index.ts                        # Public exports
```

## Key Implementation Details

### 1. Unread Count Hook (`useUnreadCount.ts`)
- Uses React Query with `refetchInterval: 30_000` (30 seconds)
- Automatically keeps the unread count live without manual refreshing
- Used by both the NotificationBell and NotificationsPage

### 2. NotificationBell Component
- Located in the AppSidebar user section (visible to all authenticated roles)
- Shows a bell icon with a numeric badge overlay (hidden when count is 0)
- Opens a popover dropdown with the 10 most recent notifications
- Each notification shows:
  - Title and message
  - Time ago (using `date-fns`)
  - Unread indicator (blue dot)
  - Mark as read button (check icon)
  - Delete button (X icon)
- "Mark all as read" action at the top
- "View all notifications" link at the bottom

### 3. NotificationsPage
- Full paginated list at `/notifications` route
- Shows 20 notifications per page
- Each notification card displays:
  - Title with unread indicator
  - Message content
  - Time ago
  - Mark as read and delete buttons (on hover)
- Unread notifications have a left border accent and muted background
- Pagination controls at the bottom
- "Mark all as read" button in the header

### 4. UI Components Created
- `components/ui/popover.tsx` - Radix UI popover wrapper for the notification dropdown

## Integration Points

### Routes (`routes.ts`)
Added: `NOTIFICATIONS: "/notifications"`

### AppRouter (`AppRouter.tsx`)
- Imported `NotificationsPage`
- Added route: `{ path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> }`

### AppSidebar (`AppSidebar.tsx`)
- Imported `NotificationBell` component
- Added to user section next to user info (visible to all authenticated users)
- Positioned using flexbox to keep user info and bell separate

## Key Features

1. **Real-time Updates**: Unread count refreshes every 30 seconds automatically
2. **Optimistic UI**: Uses React Query's `placeholderData` to prevent loading flash
3. **Smart Invalidation**: All mutations invalidate both list and unread count queries
4. **Responsive Design**: Popover dropdown and page both work well on different screen sizes
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Role-Based Access**: Available to all authenticated users (not just ORG_ADMIN)

## Notification Shape

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}
```

## Dependencies

All required dependencies were already present:
- `date-fns` - For time formatting
- `@radix-ui/react-popover` - For the dropdown (via `radix-ui` package)
- `lucide-react` - For icons
- `@tanstack/react-query` - For data fetching

## Notes

- No manual "create notification" form was built, as notifications are created internally by automation's `SEND_NOTIFICATION` action
- The feature follows the same patterns as other features (categories, priorities, etc.)
- Query keys use hierarchical structure for efficient invalidation
- All API calls go through the centralized axios client with auth interceptors
