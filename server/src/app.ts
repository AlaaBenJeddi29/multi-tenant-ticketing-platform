import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Route Imports
import authRoutes from "./modules/auth/routes/auth.routes.js";
import organizationRoutes from "./modules/organization/routes/organization.routes.js";
import categoriesRoutes from "./modules/categories/routes/categories.routes.js";

// Middleware Imports
import { errorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./lib/AppError.js";

const app = express();

// 1. Security & Logging Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// 2. Body Parsers
app.use(express.json());
app.use(cookieParser());

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/categories", categoriesRoutes);

// 4. Fallback 404 Handler for Undefined Routes
app.use((req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found.`));
});

// 5. Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;