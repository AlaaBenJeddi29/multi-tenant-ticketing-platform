import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createAutomationRuleSchema,
} from "../dto/create-automation-rule.dto.js";

import {
  updateAutomationRuleSchema,
} from "../dto/update-automation-rule.dto.js";

import * as automationService
  from "../services/automation.service.js";

export async function getAutomationRules(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const rules =
      await automationService.getAutomationRules(
        req.user!.organizationId
      );

    return res.status(200).json(rules);
  } catch (error) {
    next(error);
  }
}

export async function getAutomationRule(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const rule =
      await automationService.getAutomationRuleById(
        requireParam(
          req.params.id,
          "id"
        ),
        req.user!.organizationId
      );

    return res.status(200).json(rule);
  } catch (error) {
    next(error);
  }
}

export async function createAutomationRule(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createAutomationRuleSchema.parse(
        req.body
      );

    const rule =
      await automationService.createNewAutomationRule(
        body,
        req.user!.organizationId
      );

    return res
      .status(201)
      .json(rule);
  } catch (error) {
    next(error);
  }
}

export async function updateAutomationRule(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateAutomationRuleSchema.parse(
        req.body
      );

    const rule =
      await automationService.editAutomationRule(
        requireParam(
          req.params.id,
          "id"
        ),
        req.user!.organizationId,
        body
      );

    return res.status(200).json(rule);
  } catch (error) {
    next(error);
  }
}

export async function activateAutomationRule(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const rule =
      await automationService.activateAutomationRule(
        requireParam(
          req.params.id,
          "id"
        ),
        req.user!.organizationId
      );

    return res.status(200).json(rule);
  } catch (error) {
    next(error);
  }
}

export async function deactivateAutomationRule(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const rule =
      await automationService.deactivateAutomationRule(
        requireParam(
          req.params.id,
          "id"
        ),
        req.user!.organizationId
      );

    return res.status(200).json(rule);
  } catch (error) {
    next(error);
  }
}

export async function deleteAutomationRule(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await automationService.removeAutomationRule(
      requireParam(
        req.params.id,
        "id"
      ),
      req.user!.organizationId
    );

    return res.status(200).json({
      message:
        "Automation rule deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}