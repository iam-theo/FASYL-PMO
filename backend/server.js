import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

/* =========================
   CORE MIDDLEWARE
========================= */
import { authMiddleWare } from "./middleware/auth.middleware.js";

/* =========================
   ROUTES
========================= */
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import workflowRoutes from "./modules/workflow/workflow.routes.js";

/* =========================
   CRON JOBS (WORKFLOW ENGINE)
========================= */
import { startWorkflowEscalationCron } from "./modules/workflow/cron/workflowEscalation.cron.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   SECURITY MIDDLEWARE
========================= */

// Security headers
app.use(helmet());

// CORS config
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie support (refresh tokens etc.)
app.use(cookieParser());

/* =========================
   REQUEST LOGGER (DEV READY)
========================= */
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fasyl PMO Workflow Engine Running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   API ROUTES
========================= */

// Auth system
app.use("/api/auth", authRoutes);

// Project core CRUD + stage initialization
app.use("/api/projects", projectRoutes);

// Workflow engine (approvals, reject, escalate, stage control)
app.use("/api/workflow", workflowRoutes);

/* =========================
   PROTECTED TEST ROUTE
========================= */
app.get("/api/protected", authMiddleWare, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated access granted",
    user: req.user,
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, async () => {
  console.log(`🚀 Fasyl PMO Backend running on port ${PORT}`);

  /* =========================
     START WORKFLOW ENGINE CRON
     (Escalations, time tracking, SLA checks)
  ========================= */
  startWorkflowEscalationCron();
});