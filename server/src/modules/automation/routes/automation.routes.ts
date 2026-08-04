import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activateAutomationRule,
  createAutomationRule,
  deactivateAutomationRule,
  deleteAutomationRule,
  getAutomationRule,
  getAutomationRules,
  updateAutomationRule,
} from "../controllers/automation.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ORG_ADMIN"),
  getAutomationRules
);

router.get(
  "/:id",
  authorize("ORG_ADMIN"),
  getAutomationRule
);

router.post(
  "/",
  authorize("ORG_ADMIN"),
  createAutomationRule
);

router.patch(
  "/:id",
  authorize("ORG_ADMIN"),
  updateAutomationRule
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN"),
  activateAutomationRule
);

router.patch(
  "/:id/deactivate",
  authorize("ORG_ADMIN"),
  deactivateAutomationRule
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deleteAutomationRule
);

export default router;