import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activateRequester,
  createRequester,
  deactivateRequester,
  deleteRequester,
  getRequester,
  getRequesters,
  updateRequester,
} from "../controllers/requester.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ORG_ADMIN", "AGENT"),
  getRequesters
);

router.get(
  "/:id",
  authorize("ORG_ADMIN", "AGENT"),
  getRequester
);

router.post(
  "/",
  authorize("ORG_ADMIN", "AGENT"),
  createRequester
);

router.patch(
  "/:id",
  authorize("ORG_ADMIN", "AGENT"),
  updateRequester
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN", "AGENT"),
  activateRequester
);

router.patch(
  "/:id/deactivate",
  authorize("ORG_ADMIN", "AGENT"),
  deactivateRequester
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN", "AGENT"),
  deleteRequester
);

export default router;