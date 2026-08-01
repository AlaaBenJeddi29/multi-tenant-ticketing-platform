import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";
import { authorize } from "../../../middleware/authorize.middleware.js";

import {
  activateAsset,
  createAsset,
  deleteAsset,
  getAsset,
  getAssets,
  maintenanceAsset,
  retireAsset,
  updateAsset,
} from "../controller/assets.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getAssets);

router.get("/:id", getAsset);

router.post(
  "/",
  authorize("ORG_ADMIN"),
  createAsset
);

router.put(
  "/:id",
  authorize("ORG_ADMIN"),
  updateAsset
);

router.patch(
  "/:id/activate",
  authorize("ORG_ADMIN"),
  activateAsset
);

router.patch(
  "/:id/maintenance",
  authorize("ORG_ADMIN"),
  maintenanceAsset
);

router.patch(
  "/:id/retire",
  authorize("ORG_ADMIN"),
  retireAsset
);

router.delete(
  "/:id",
  authorize("ORG_ADMIN"),
  deleteAsset
);

export default router;