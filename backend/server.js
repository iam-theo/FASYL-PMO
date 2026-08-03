console.log("SERVER STARTING...");
console.log("ENV PATH TEST:", process.cwd());

import dotenv from "dotenv";
dotenv.config();

import express from "express";
// import path from "path"
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import {
  apiLimiter,
} from "./middleware/rateLimit.middleware.js"
import { startSalesSync } from "./modules/projects/salesSync.job.js";

import {
  startReminderScheduler,
} from "./modules/reminders/reminder.scheduler.js";

/* =========================
    ROUTES IMPORTS
========================= */
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import workflowRoutes from "./modules/workflow/workflow.routes.js";
// import { ErrorHandler } from "./middleware/error.middleware.js";
import taskRoutes from "./modules/tasks/tasks.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";
import reminderRoutes from "./modules/reminders/reminder.routes.js";

/* =========================
    INIT
========================= */
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// START SYNC SYSTEM
startSalesSync();

app.listen(5000, () => {
  console.log("Server running on 5000");
});

/* =========================
   ENV
========================= */
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const NODE_ENV = process.env.NODE_ENV || "development";

const API_V1 = "/api/v1";
const API_LEGACY = "/api";

app.use(apiLimiter);

/* =========================
   TRUST PROXY
========================= */
app.set("trust proxy", 1);

/* =========================
   CORE MIDDLEWARE
========================= */
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static("backend/uploads"));

/* =========================
    REQUEST LOGGER
========================= */
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

/* =========================
    ROUTE MOUNTING (DUAL SUPPORT)
========================= */

/**
 * AUTH
 */
app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_LEGACY}/auth`, authRoutes);

/**
 * PROJECTS
 */
app.use(`${API_V1}/projects`, projectRoutes);
app.use(`${API_LEGACY}/projects`, projectRoutes);

/**
 * WORKFLOW
 */
app.use(`${API_V1}/workflow`, workflowRoutes);
app.use(`${API_LEGACY}/workflow`, workflowRoutes);

// =========================
// TASKS
// =========================

app.use(`${API_V1}/tasks`, taskRoutes);
app.use(`${API_LEGACY}/tasks`,taskRoutes);

// =========================
// REPORTS
// =========================

app.use(
  `${API_V1}/reports`,
  reportRoutes
);

app.use(
  `${API_LEGACY}/reports`,
  reportRoutes
);

// =========================
// REMINDERS
// =========================

app.use(
  `${API_V1}/reminders`,
  reminderRoutes
);

app.use(
  `${API_LEGACY}/reminders`,
  reminderRoutes
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });

/* =========================
    HEALTH CHECK
========================= */
app.get(`${API_V1}/health`, (req, res) => {
  res.json({
    success: true,
    message: "PMO Workflow API running",
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* =========================
    PRISMA TEST ROUTE
========================= */
app.get(`${API_V1}/test-db`, async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
    GLOBAL 404
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================
    GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res) => {
  console.error("🔥 SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// app.use(ErrorHandler);

startSalesSync();

startReminderScheduler();

/* =========================
    START SERVER
========================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 API (v1): ${API_V1}`);
  console.log(`📦 Legacy API: ${API_LEGACY}`);
  console.log(`📚 Docs: http://localhost:${PORT}/docs`);
  console.log(`📊 Reports API: ${API_V1}/reports`);
  console.log(`⏰ Reminders API: ${API_V1}/reminders`);
  console.log(`❤️ Health Check: ${API_V1}/health`);
});

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

const gracefulShutdown = async (signal) => {
  console.log(
    `\n🛑 ${signal} received. Shutting down server...`
  );

  try {

    // Stop reminder scheduler
    // This prevents new scheduler executions
    // during server shutdown.
    console.log(
      "⏰ Stopping reminder scheduler..."
    );

    // Stop sales sync if your job exposes
    // a stop function in the future.

    // Close HTTP server
    await new Promise((resolve) => {
      server.close(() => {
        console.log(
          "🌐 HTTP server closed."
        );

        resolve();
      });
    });


    // Disconnect Prisma
    await prisma.$disconnect();

    console.log(
      "🗄️ Prisma disconnected."
    );

    console.log(
      "✅ Server shutdown completed."
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "❌ Error during server shutdown:",
      error
    );

    await prisma.$disconnect();

    process.exit(1);
  }
};


// =========================
// PROCESS SIGNALS
// =========================

process.on(
  "SIGINT",
  () => gracefulShutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => gracefulShutdown("SIGTERM")
);