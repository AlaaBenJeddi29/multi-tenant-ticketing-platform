import type {
  NextFunction,
  Response,
} from "express";

import { AppError } from "../../../lib/AppError.js";

import type { SubmitRequestDto } from "../dto/submit-request.dto.js";

import { submitRequestSchema } from "../dto/submit-request.dto.js";

import { findOrganizationBySlug } from "../../organization/repositories/organization.repository.js";

import {
  findRequesterByEmail,
  createRequester,
} from "../../requesters/repositories/requester.respoitroy.js";

import { prisma } from "../../../lib/prisma.js";

import { findActiveSlaByPriority } from "../../sla/repositories/sla.repository.js";

import { calculateSlaDeadlines } from "../../automation/index.js";

export async function submitRequest(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const body: SubmitRequestDto = submitRequestSchema.parse(req.body);

    // a. Find organization by slug
    const organization = await findOrganizationBySlug(body.organizationSlug);
    if (!organization) {
      throw new AppError(404, "Organization not found.");
    }

    // b. Find or create requester by email
    let requester = await findRequesterByEmail(body.email, organization.id);
    if (!requester) {
      requester = await createRequester({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        organization: {
          connect: {
            id: organization.id,
          },
        },
        isActive: true,
      });
    }

    // c. Find lowest-level active priority
    const priority = await prisma.priority.findFirst({
      where: {
        organizationId: organization.id,
        isActive: true,
      },
      orderBy: {
        level: "asc",
      },
    });

    if (!priority) {
      throw new AppError(400, "No active priority配置 found for this organization.");
    }

    // d. Find first active category
    const category = await prisma.category.findFirst({
      where: {
        organizationId: organization.id,
        isActive: true,
      },
    });

    if (!category) {
      throw new AppError(400, "No active category found for this organization.");
    }

    // e. Find first active ORG_ADMIN user
    const orgAdmin = await prisma.user.findFirst({
      where: {
        organizationId: organization.id,
        role: "ORG_ADMIN",
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!orgAdmin) {
      throw new AppError(400, "No active organization admin found.");
    }

    // f. Calculate SLA deadlines
    const sla = await findActiveSlaByPriority(priority.id, organization.id);
    if (!sla) {
      throw new AppError(400, "No active SLA found for the selected priority.");
    }

    const { responseDueAt, resolutionDueAt } = calculateSlaDeadlines(
      sla.responseTimeMinutes,
      sla.resolutionTimeMinutes
    );

    // g. Get next ticket number
    const lastTicket = await prisma.ticket.findFirst({
      where: {
        organizationId: organization.id,
      },
      orderBy: {
        ticketNumber: "desc",
      },
      select: {
        ticketNumber: true,
      },
    });

    const nextTicketNumber = (lastTicket?.ticketNumber ?? 0) + 1;

    // h. Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: nextTicketNumber,
        title: body.subject,
        description: body.description,
        status: "NEW",
        responseDueAt,
        resolutionDueAt,
        organization: {
          connect: {
            id: organization.id,
          },
        },
        priority: {
          connect: {
            id: priority.id,
          },
        },
        category: {
          connect: {
            id: category.id,
          },
        },
        requester: {
          connect: {
            id: requester.id,
          },
        },
        createdBy: {
          connect: {
            id: orgAdmin.id,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      ticketNumber: ticket.ticketNumber,
      message: "Your request has been submitted.",
    });
  } catch (error) {
    next(error);
  }
}
