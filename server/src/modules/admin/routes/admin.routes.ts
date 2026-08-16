import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  getDashboard,
  getOrganizations,
  getOrganization,
  suspendOrganization,
  activateOrganization,
  getUsers,
  toggleUserActive,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(authenticate);

// Dashboard
router.get(
  "/dashboard",
  authorize("SUPER_ADMIN"),
  getDashboard
);

// Organizations
router.get(
  "/organizations",
  authorize("SUPER_ADMIN"),
  getOrganizations
);

router.get(
  "/organizations/:id",
  authorize("SUPER_ADMIN"),
  getOrganization
);

router.patch(
  "/organizations/:id/suspend",
  authorize("SUPER_ADMIN"),
  suspendOrganization
);

router.patch(
  "/organizations/:id/activate",
  authorize("SUPER_ADMIN"),
  activateOrganization
);

// Users
router.get(
  "/users",
  authorize("SUPER_ADMIN"),
  getUsers
);

router.patch(
  "/users/:id/toggle-active",
  authorize("SUPER_ADMIN"),
  toggleUserActive
);

export default router;
