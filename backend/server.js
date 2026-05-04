import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

/* =========================
   PORT (MUST BE FIRST)
========================= */
const PORT = process.env.PORT || 5000;

/* =========================
   SWAGGER CONFIG
========================= */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fasyl PMO Enterprise API",
      version: "1.0.0",
      description:
        "PMO Workflow & Project Governance System with Role-Based Approvals and Lifecycle Management",
    },

    servers: [
      {
        url: process.env.BASE_URL || `http://localhost:${PORT}/api`,
      },
    ],

    tags: [
      { name: "Authentication", description: "Auth, login, token management" },
      { name: "Projects", description: "Project lifecycle CRUD" },
      { name: "Workflow", description: "Stage approvals and governance engine" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      /* =========================
         🧩 REUSABLE SCHEMAS (DRY)
      ========================= */
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error occurred" },
            error: { type: "object" },
          },
        },

        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
          },
        },

        Project: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            status: {
              type: "string",
              enum: ["draft", "active", "completed", "archived"],
            },
          },
        },

        WorkflowState: {
          type: "object",
          properties: {
            projectId: { type: "string" },
            stage: { type: "string" },
            status: {
              type: "string",
              enum: [
                "pending",
                "submitted",
                "approved",
                "rejected",
                "escalated",
              ],
            },
            updatedBy: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ["./backend/modules/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/* =========================
   CORE IMPORTS
========================= */
import { authMiddleWare } from "./middleware/auth.middleware.js";

/* =========================
   ROUTES
========================= */
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import workflowRoutes from "./modules/workflow/workflow.routes.js";

/* =========================
   CRON JOBS
========================= */
import { startWorkflowEscalationCron } from "./modules/workflow/cron/workflowEscalation.cron.js";

/* =========================
   APP INIT
========================= */
const app = express();

/* =========================
   SECURITY MIDDLEWARE
========================= */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   SWAGGER UI ROUTE
========================= */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =========================
   REQUEST LOGGER
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
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
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
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/docs`);

  startWorkflowEscalationCron();
});