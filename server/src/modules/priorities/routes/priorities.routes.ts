import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activatePriority,
  createPriority,
  deactivatePriority,
  deletePriority,
  getPriorities,
  getPriority,
  updatePriority,
} from "./../controller/priorities.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getPriorities);

router.get("/:id", getPriority);

router.post(
  "/",
  authorize("ORG_ADMIN"),
  createPriority
);

router.put(
  "/:id",
  authorize("ORG_ADMIN"),
  updatePriority
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN"),
  activatePriority
);

router.patch(
  "/:id/deactivate",
  authorize("ORG_ADMIN"),
  deactivatePriority
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deletePriority
);

export default router;