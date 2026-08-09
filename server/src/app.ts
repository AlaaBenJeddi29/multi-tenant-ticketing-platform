import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { startAutomationJobs } from "./modules/automation/jobs/automation.jobs.js";
// Route Imports
import authRoutes from "./modules/auth/routes/auth.routes.js";
import organizationRoutes from "./modules/organization/routes/organization.routes.js";
import categoriesRoutes from "./modules/categories/routes/categories.routes.js";

// Middleware Imports
import { errorHandler } from "./middleware/error.middleware.js";
import { AppError } from "./lib/AppError.js";
import prioritiesRoutes from "./modules/priorities/routes/priorities.routes.js";
import assetsRoutes from "./modules/assets/routes/assets.routes.js";
import customerRoutes from "./modules/requesters/routes/requester.routes.js";
import requesterRoutes from "./modules/requesters/routes/requester.routes.js";
import ticketRoutes from "./modules/tickets/routes/ticket.routes.js";
import slaRoutes from "./modules/sla/routes/sla.routes.js";
import commentRoutes from "./modules/comments/routes/comment.routes.js";
import automationRoutes from "./modules/automation/routes/automation.routes.js";
import dashboardRoutes from "./modules/dashboard/routes/dashboard.routes.js";
import usersRoutes from "./modules/users/routes/users.routes.js";
import notificationRoutes from "./modules/notifications/routes/notification.routes.js";

const app = express();
startAutomationJobs();
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
app.use("/api/priorities",prioritiesRoutes);
app.use("/api/assets",assetsRoutes);
app.use("/api/requesters", requesterRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/slas", slaRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/notifications", notificationRoutes);



// 4. Fallback 404 Handler for Undefined Routes
app.use((req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found.`));
});

// 5. Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;