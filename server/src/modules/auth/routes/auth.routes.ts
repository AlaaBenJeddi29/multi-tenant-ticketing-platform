import { Router } from "express";

import { forgotPassword, logout, me, register, resetPassword, verifyResetCode, refresh } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);
router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
  "/verify-reset-code",
  verifyResetCode
);

router.post(
  "/reset-password",
  resetPassword
);
export default router;