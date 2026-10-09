import { Router } from "express";

import {
  getNotificationsHandler,
  getNotificationHandler,
  markNotificationAsReadHandler,
  markAllNotificationsAsReadHandler,
  getUnreadCountHandler,
  deleteNotificationHandler,
} from "../controllers/notification.controller.js";

import { authenticate } from "../../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// GET /api/notifications
router.get(
  "/",
  getNotificationsHandler
);

// GET /api/notifications/unread
router.get(
  "/unread",
  getUnreadCountHandler
);

// GET /api/notifications/:id
router.get(
  "/:id",
  getNotificationHandler
);

// PATCH /api/notifications/:id/read
router.patch(
  "/:id/read",
  markNotificationAsReadHandler
);

// PATCH /api/notifications/read-all
router.patch(
  "/read-all",
  markAllNotificationsAsReadHandler
);

// DELETE /api/notifications/:id
router.delete(
  "/:id",
  deleteNotificationHandler
);

export default router;

