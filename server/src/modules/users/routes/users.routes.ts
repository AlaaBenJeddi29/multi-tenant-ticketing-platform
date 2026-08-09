import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activateUser,
  createUser,
  deactivateUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/users.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("ORG_ADMIN"),
  getUsers
);

router.get(
  "/:id",
  authorize("ORG_ADMIN"),
  getUser
);

router.post(
  "/",
  authorize("ORG_ADMIN"),
  createUser
);

router.patch(
  "/:id",
  authorize("ORG_ADMIN"),
  updateUser
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN"),
  activateUser
);

router.patch(
  "/:id/deactivate",
  authorize("ORG_ADMIN"),
  deactivateUser
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deleteUser
);

export default router;
