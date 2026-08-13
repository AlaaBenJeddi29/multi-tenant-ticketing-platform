import { Router } from "express";

import { forgotPassword, logout, me, register, resetPassword, verifyResetCode, refresh } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../../middleware/rate-limit.middleware.js";

const router = Router();

// Apply strict rate limiting to brute-force-vulnerable endpoints
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);
router.post(
    "/forgot-password",
    authRateLimiter,
    forgotPassword
);

router.post(
  "/verify-reset-code",
  verifyResetCode
);

router.post(
  "/reset-password",
  authRateLimiter,
  resetPassword
);
export default router;