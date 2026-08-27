import { Router } from "express";

import { forgotPassword, logout, me, register, resetPassword, verifyResetCode, refresh, getProfile, updateProfile, changePassword, getSessions, revokeSession, revokeAllSessions } from "../controllers/auth.controller.js";
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

// Profile endpoints (authenticated user's own profile only)
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);

// Session endpoints (authenticated user's own sessions only)
router.get("/sessions", authenticate, getSessions);
router.delete("/sessions/:sessionId", authenticate, revokeSession);
router.delete("/sessions", authenticate, revokeAllSessions);

export default router;