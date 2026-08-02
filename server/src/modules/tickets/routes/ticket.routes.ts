import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  assignTicket,
  updateTicketStatus,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ORG_ADMIN", "AGENT"),
  getTickets
);

router.get(
  "/:id",
  authorize("ORG_ADMIN", "AGENT"),
  getTicket
);

router.post(
  "/",
  authorize("ORG_ADMIN", "AGENT"),
  createTicket
);

router.patch(
  "/:id",
  authorize("ORG_ADMIN", "AGENT"),
  updateTicket
);

router.patch(
  "/:id/assign",
  authorize("ORG_ADMIN"),
  assignTicket
);

router.patch(
  "/:id/status",
  authorize("ORG_ADMIN", "AGENT"),
  updateTicketStatus
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deleteTicket
);

export default router;