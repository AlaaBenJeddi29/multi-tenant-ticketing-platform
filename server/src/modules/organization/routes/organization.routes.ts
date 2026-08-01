import { Router } from "express";

import {
  authenticate,
} from "../../../middleware/auth.middleware.js";

import {
  authorize,
} from "../../../middleware/authorize.middleware.js";

import {
  getOrganizations,
  getOrganization,
  getMyOrganization,
  updateOrganization,
  updateMyOrganization,
} from "../controllers/organization.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("SUPER_ADMIN"),
  getOrganizations
);

router.get(
  "/me",
  authorize("ORG_ADMIN"),
  getMyOrganization
);

router.put(
  "/me",
  authorize("ORG_ADMIN"),
  updateMyOrganization
);

router.get(
  "/:id",
  authorize("SUPER_ADMIN"),
  getOrganization
);

router.put(
  "/:id",
  authorize("SUPER_ADMIN"),
  updateOrganization
);

export default router;