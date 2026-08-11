import type { Response, NextFunction } from "express";

import { requireParam } from "../../../lib/params.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

import { createNotificationSchema } from "../dto/create-notification.dto.js";

import { updateNotificationSchema } from "../dto/update-notification.dto.js";

import { listNotificationsQuerySchema } from "../dto/list-notifications.dto.js";

import {
  createNewNotification,
  getNotificationById,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markNotificationAsRead,
  removeNotification,
} from "../services/notification.service.js";

export async function getNotificationsHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;
    const query = listNotificationsQuerySchema.parse(req.query);

    const notifications = await getNotifications(userId, query);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

export async function getNotificationHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const notification = await getNotificationById(
      requireParam(req.params.id, "id"),
      req.user!.userId
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNotificationHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = createNotificationSchema.parse(req.body);

    const notification = await createNewNotification(dto);

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsReadHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = updateNotificationSchema.parse(req.body);

    const notification = await markNotificationAsRead(
      requireParam(req.params.id, "id"),
      req.user!.userId,
      dto
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationsAsReadHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await markAllAsRead(req.user!.userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCountHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getUnreadCount(req.user!.userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotificationHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await removeNotification(
      requireParam(req.params.id, "id"),
      req.user!.userId
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}