import type { NextFunction, Response } from "express";
import { requireParam } from "../../../lib/params.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import { createUserSchema } from "../dto/create-user.dto.js";
import { updateUserSchema } from "../dto/update-user.dto.js";
import * as usersService from "../services/users.service.js";

export async function getUsers(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await usersService.getUsers(
      req.user!.organizationId
    );

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = requireParam(req.params.id, "id");
    const user = await usersService.getUserById(
      userId,
      req.user!.organizationId
    );

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body = createUserSchema.parse(req.body);

    const user = await usersService.createNewUser(
      body,
      req.user!.organizationId
    );

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = requireParam(req.params.id, "id");
    const body = updateUserSchema.parse(req.body);

    const user = await usersService.editUser(
      userId,
      req.user!.organizationId,
      body
    );

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function activateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = requireParam(req.params.id, "id");
    const user = await usersService.activateUser(
      userId,
      req.user!.organizationId
    );

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function deactivateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = requireParam(req.params.id, "id");
    const user = await usersService.deactivateUser(
      userId,
      req.user!.organizationId
    );

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = requireParam(req.params.id, "id");
    await usersService.removeUser(
      userId,
      req.user!.organizationId
    );

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}