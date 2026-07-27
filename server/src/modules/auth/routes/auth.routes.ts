import { Router } from "express";

import { logout, me, register } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);
export default router;