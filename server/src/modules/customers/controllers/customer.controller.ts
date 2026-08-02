import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createCustomerSchema,
} from "../dto/create-customer.dto.js";

import {
  updateCustomerSchema,
} from "../dto/update-customer.dto.js";

import * as customerService
  from "../services/customer.service.js";

export async function getCustomers(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const customers =
      await customerService.getCustomers(
        req.user!.organizationId
      );

    return res.json(customers);
  } catch (error) {
    next(error);
  }
}

export async function getCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const customer =
      await customerService.getCustomerById(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.json(customer);
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createCustomerSchema.parse(req.body);

    const customer =
      await customerService.createNewCustomer(
        body,
        req.user!.organizationId
      );

    return res
      .status(201)
      .json(customer);
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateCustomerSchema.parse(req.body);

    const customer =
      await customerService.editCustomer(
        requireParam(req.params.id, "id"),
        req.user!.organizationId,
        body
      );

    return res.json(customer);
  } catch (error) {
    next(error);
  }
}

export async function activateCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const customer =
      await customerService.activateCustomer(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.json(customer);
  } catch (error) {
    next(error);
  }
}

export async function deactivateCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const customer =
      await customerService.deactivateCustomer(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.json(customer);
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await customerService.removeCustomer(
      requireParam(req.params.id, "id"),
      req.user!.organizationId
    );

    return res.json({
      message:
        "Customer deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}