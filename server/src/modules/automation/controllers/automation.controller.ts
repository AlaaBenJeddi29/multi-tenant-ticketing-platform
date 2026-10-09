import type {
  NextFunction,
  Response,
} from "express";

import { AppError } from "../../../lib/AppError.js";
import { requireParam } from "../../../lib/params.js";
import { requireOrganizationId } from "../../../lib/request.js";
import { prisma } from "../../../lib/prisma.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createAutomationRuleSchema,
} from "../dto/create-automation-rule.dto.js";

import {
  updateAutomationRuleSchema,
} from "../dto/update-automation-rule.dto.js";

import {
  listAutomationRulesQuerySchema,
} from "../dto/list-automation-rules.dto.js";

import {
  listExecutionsQuerySchema,
} from "../dto/list-executions.dto.js";

import * as automationService
  from "../services/automation.service.js";

import {
  findAutomationExecutions,
} from "../repositories/automation-execution.repository.js";

export async function getAutomationRules(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listAutomationRulesQuerySchema.parse(req.query);

    const rules =
      await automationService.getAutomationRules(
        requireOrganizationId(req),
        query
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
        requireOrganizationId(req)
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

    const organizationId = requireOrganizationId(req);

    // Database-level validation for actionValue
    if (body.action === "ASSIGN_AGENT" && body.actionValue) {
      const user = await prisma.user.findFirst({
        where: {
          id: body.actionValue,
          organizationId,
          isActive: true,
          role: "AGENT",
        },
      });

      if (!user) {
        throw new AppError(
          400,
          "Invalid agent: user not found or does not belong to this organization"
        );
      }
    }

    if (body.action === "CHANGE_PRIORITY" && body.actionValue) {
      const priority = await prisma.priority.findFirst({
        where: {
          id: body.actionValue!,
          organizationId,
          isActive: true,
        },
      });

      if (!priority) {
        throw new AppError(
          400,
          "Invalid priority: not found or does not belong to this organization"
        );
      }
    }

    // For CLOSE_TICKET and REOPEN_TICKET, overwrite actionValue with empty string
    if (body.action === "CLOSE_TICKET" || body.action === "REOPEN_TICKET") {
      body.actionValue = "";
    }

    const rule =
      await automationService.createNewAutomationRule(
        body,
        organizationId
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

    const organizationId = requireOrganizationId(req);

    // Database-level validation for actionValue (only if action is being updated)
    if (body.action === "ASSIGN_AGENT" && body.actionValue) {
      const user = await prisma.user.findFirst({
        where: {
          id: body.actionValue!,
          organizationId,
          isActive: true,
          role: "AGENT",
        },
      });

      if (!user) {
        throw new AppError(
          400,
          "Invalid agent: user not found or does not belong to this organization"
        );
      }
    }

    if (body.action === "CHANGE_PRIORITY" && body.actionValue) {
      const priority = await prisma.priority.findFirst({
        where: {
          id: body.actionValue!,
          organizationId,
          isActive: true,
        },
      });

      if (!priority) {
        throw new AppError(
          400,
          "Invalid priority: not found or does not belong to this organization"
        );
      }
    }

    // For CLOSE_TICKET and REOPEN_TICKET, overwrite actionValue with empty string
    if (body.action === "CLOSE_TICKET" || body.action === "REOPEN_TICKET") {
      body.actionValue = "";
    }

    const rule =
      await automationService.editAutomationRule(
        requireParam(
          req.params.id,
          "id"
        ),
        organizationId,
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
        requireOrganizationId(req)
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
        requireOrganizationId(req)
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
      requireOrganizationId(req)
    );

    return res.status(200).json({
      message:
        "Automation rule deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function getAutomationExecutions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query = listExecutionsQuerySchema.parse(req.query);

    const { items, total } = await findAutomationExecutions(
      requireOrganizationId(req),
      query.page,
      query.pageSize
    );

    return res.status(200).json({
      data: items,
      total,
      page: query.page,
      pageSize: query.pageSize,
    });
  } catch (error) {
    next(error);
  }
}