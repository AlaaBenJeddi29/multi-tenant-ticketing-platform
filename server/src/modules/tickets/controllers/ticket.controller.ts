import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createTicketSchema,
} from "../dto/create-ticket.dto.js";

import {
  updateTicketSchema,
} from "../dto/update-ticket.dto.js";

import {
  assignTicketSchema,
} from "../dto/assign-ticket.dto.js";

import {
  updateTicketStatusSchema,
} from "../dto/update-ticket-status.dto.js";

import {
  listTicketsQuerySchema,
} from "../dto/list-tickets.dto.js";

import * as ticketService from "../services/ticket.service.js";

export async function getTickets(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query = listTicketsQuerySchema.parse(req.query);

    if (!req.user?.role || !req.user?.userId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const tickets = await ticketService.getTickets(
      req.user.organizationId!,
      req.user.role,
      req.user.userId,
      query
    );

    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
}

export async function getTicket(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.role || !req.user?.userId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const ticket = await ticketService.getTicketById(
      requireParam(req.params.id, "id"),
      req.user.organizationId!,
      req.user.role,
      req.user.userId
    );

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body = createTicketSchema.parse(req.body);

    if (!req.user?.userId || !req.user?.organizationId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const ticket = await ticketService.createNewTicket(
      body,
      req.user.organizationId,
      req.user.userId
    );

    return res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body = updateTicketSchema.parse(req.body);

    if (!req.user?.organizationId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const ticket = await ticketService.editTicket(
      requireParam(req.params.id, "id"),
      req.user.organizationId,
      body
    );

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function assignTicket(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body = assignTicketSchema.parse(req.body);

    if (!req.user?.organizationId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const ticket = await ticketService.assignTicket(
      requireParam(req.params.id, "id"),
      req.user.organizationId,
      body
    );

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function updateTicketStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body = updateTicketStatusSchema.parse(req.body);

    if (!req.user?.organizationId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const ticket = await ticketService.updateStatus(
      requireParam(req.params.id, "id"),
      req.user.organizationId,
      body
    );

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.organizationId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    await ticketService.removeTicket(
      requireParam(req.params.id, "id"),
      req.user.organizationId
    );

    return res.status(200).json({
      message: "Ticket deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function claimTicket(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.organizationId || !req.user?.userId) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const ticket = await ticketService.assignTicket(
      requireParam(req.params.id, "id"),
      req.user.organizationId,
      { assignedToId: req.user.userId }
    );

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}