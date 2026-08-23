import type {
  NextFunction,
  Response,
  Request,
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

export async function submitRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('[Public Submit] Received request:', {
      body: req.body,
      params: req.params,
    });
    
    const body: SubmitRequestDto = submitRequestSchema.parse(req.body);
    const organizationSlug = Array.isArray(req.params.organizationSlug) 
      ? req.params.organizationSlug[0] 
      : req.params.organizationSlug;

    console.log('[Public Submit] Organization slug:', organizationSlug);

    // 1. Find organization by slug
    const org = await prisma.organization.findUnique({
      where: { slug: organizationSlug },
    });

    if (!org) {
      console.log('[Public Submit] Organization not found:', organizationSlug);
      throw new AppError(404, "Organization not found");
    }

    console.log('[Public Submit] Organization found:', org.name);

    // 2. Find or create requester by email within this organization
    const existing = await prisma.requester.findFirst({
      where: { email: body.email, organizationId: org.id },
    });

    let requester;
    if (existing) {
      requester = existing;
      console.log('[Public Submit] Using existing requester:', requester.id);
    } else {
      // Create requester with full data from form
      console.log('[Public Submit] Creating new requester');
      requester = await createRequester({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || "",
        company: body.company || "",
        notes: body.notes || "",
        isActive: true,
        organization: {
          connect: {
            id: org.id,
          },
        },
      });
      console.log('[Public Submit] Created requester:', requester.id);
    }

    // 3. Find first active ORG_ADMIN of the organization to use as createdById
    console.log('[Public Submit] Finding admin user');
    const adminUser = await prisma.user.findFirst({
      where: { organizationId: org.id, role: 'ORG_ADMIN', isActive: true },
    });

    if (!adminUser) {
      console.log('[Public Submit] No admin user found');
      throw new AppError(400, "Organization has no active administrator");
    }
    console.log('[Public Submit] Admin user found:', adminUser.id);

    // 4. Find the lowest-level active Priority in the organization to use as default
    console.log('[Public Submit] Finding priority');
    let defaultPriority = await prisma.priority.findFirst({
      where: { organizationId: org.id, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    // If no priority found, create a default one
    if (!defaultPriority) {
      console.log('[Public Submit] Creating default priority');
      defaultPriority = await prisma.priority.create({
        data: {
          name: "Default",
          level: "LOW",
          color: "#6b7280",
          isActive: true,
          organizationId: org.id,
        },
      });
    }
    console.log('[Public Submit] Priority found/created:', defaultPriority.id);

    // 5. Find the first active Category in the organization to use as default
    console.log('[Public Submit] Finding category');
    let defaultCategory = await prisma.category.findFirst({
      where: { organizationId: org.id, isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    // If no category found, create a default one
    if (!defaultCategory) {
      console.log('[Public Submit] Creating default category');
      defaultCategory = await prisma.category.create({
        data: {
          name: "General",
          description: "Default category for public submissions",
          isActive: true,
          organizationId: org.id,
        },
      });
    }
    console.log('[Public Submit] Category found/created:', defaultCategory.id);

    // 6. Generate ticket number (same method as existing ticket service)
    console.log('[Public Submit] Generating ticket number');
    const lastTicket = await prisma.ticket.findFirst({
      where: { organizationId: org.id },
      orderBy: { ticketNumber: 'desc' },
      select: { ticketNumber: true },
    });

    const nextTicketNumber = (lastTicket?.ticketNumber ?? 0) + 1;
    console.log('[Public Submit] Next ticket number:', nextTicketNumber);

    // 7. Create the Ticket (no SLA for public submissions)
    console.log('[Public Submit] Creating ticket');
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: nextTicketNumber,
        title: body.subject,
        description: body.description,
        status: 'NEW',
        source: 'PORTAL',
        requesterId: requester.id,
        organizationId: org.id,
        createdById: adminUser.id,
        assignedToId: null,
        priorityId: defaultPriority.id,
        categoryId: defaultCategory.id,
        responseDueAt: new Date(), // Placeholder, will be set by agent
        resolutionDueAt: new Date(), // Placeholder, will be set by agent
      },
    });
    console.log('[Public Submit] Ticket created:', ticket.id);

    // 8. Return success response
    console.log('[Public Submit] Sending success response');
    return res.status(200).json({
      success: true,
      ticketNumber: ticket.ticketNumber,
      message: "Your request has been submitted successfully.",
    });
  } catch (error) {
    console.error('[Public Submit] Error:', error);
    next(error);
  }
}
