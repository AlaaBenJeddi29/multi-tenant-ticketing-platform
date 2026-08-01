import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./modules/auth/routes/auth.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";
import organizationRoutes from "./modules/organization/routes/organization.routes.js";

const app = express();

// Security & Logging Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  "/api/organizations",
  organizationRoutes
);
// API Routes
app.use("/api/auth", authRoutes);

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;