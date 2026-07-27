import { Router } from "express";

import { forgotPassword, logout, me, register } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.post(
    "/forgot-password",
    forgotPassword
);
export default router;