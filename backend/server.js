console.log("SERVER STARTING...");
console.log("ENV PATH TEST:", process.cwd());

import dotenv from "dotenv";
dotenv.config();

import { connectCloudinary } from "./config/cloudinary.js";
connectCloudinary();

import express from "express";
import path from "path"
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { PrismaClient } from "@prisma/client";

/* =========================
   INIT
========================= */
const app = express();
const prisma = new PrismaClient();

/* =========================
   ENV
========================= */
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const NODE_ENV = process.env.NODE_ENV || "development";

const API_V1 = "/api/v1";
const API_LEGACY = "/api";

app.use("/uploads", express.static("backend/uploads"));

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

/* =========================
   REQUEST LOGGER
========================= */
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

/* =========================
   ROUTES IMPORTS
========================= */
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import workflowRoutes from "./modules/workflow/workflow.routes.js";

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

/* =========================
   SWAGGER CONFIG
========================= */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fasyl PMO Workflow API",
      version: "1.0.0",
      description:
        "Enterprise PMO system with workflow stages, approvals, and governance",
    },

    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:5000/api/v1",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./modules/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/* =========================
   SWAGGER ROUTES
========================= */
app.get(`${API_V1}/docs-json`, (req, res) => {
  res.json(swaggerSpec);
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    persistAuthorization: true,
  })
);

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 API (v1): ${API_V1}`);
  console.log(`📦 Legacy API: ${API_LEGACY}`);
  console.log(`📚 Docs: http://localhost:${PORT}/docs`);
});