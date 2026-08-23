import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitRequest } from "../controllers/public.controller.js";

const router = Router();

// Rate limiter for public submission endpoint
// 5 requests per 15 minutes per IP
const publicSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});

router.post("/:organizationSlug/submit", publicSubmissionLimiter, submitRequest);

export default router;
