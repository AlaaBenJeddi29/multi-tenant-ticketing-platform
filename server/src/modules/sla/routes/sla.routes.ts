import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";

import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activateSla,
  createSla,
  deactivateSla,
  deleteSla,
  getSla,
  getSlas,
  updateSla,
} from "../controllers/sla.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize(
    "ORG_ADMIN",
    "AGENT"
  ),
  getSlas
);

router.get(
  "/:id",
  authorize(
    "ORG_ADMIN",
    "AGENT"
  ),
  getSla
);

router.post(
  "/",
  authorize("ORG_ADMIN"),
  createSla
);

router.patch(
  "/:id",
  authorize("ORG_ADMIN"),
  updateSla
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN"),
  activateSla
);

router.patch(
  "/:id/deactivate",
  authorize("ORG_ADMIN"),
  deactivateSla
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deleteSla
);

export default router;