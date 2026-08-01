import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activateCategory,
  createCategory,
  deactivateCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controller/categories.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post(
  "/",
  authorize("ORG_ADMIN"),
  createCategory
);

router.put(
  "/:id",
  authorize("ORG_ADMIN"),
  updateCategory
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN"),
  activateCategory
);

router.patch(
  "/:id/deactivate",
  authorize("ORG_ADMIN"),
  deactivateCategory
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deleteCategory
);

export default router;