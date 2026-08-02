import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activateCustomer,
  createCustomer,
  deactivateCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/customer.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ORG_ADMIN", "AGENT"),
  getCustomers
);

router.get(
  "/:id",
  authorize("ORG_ADMIN", "AGENT"),
  getCustomer
);

router.post(
  "/",
  authorize("ORG_ADMIN"),
  createCustomer
);

router.patch(
  "/:id",
  authorize("ORG_ADMIN"),
  updateCustomer
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN"),
  activateCustomer
);

router.patch(
  "/:id/deactivate",
  authorize("ORG_ADMIN"),
  deactivateCustomer
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deleteCustomer
);

export default router;