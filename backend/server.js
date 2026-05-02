import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

/* =========================
   MIDDLEWARE
========================= */
import { authMiddleWare } from "./middleware/auth.middleware.js";

/* =========================
   ROUTES
========================= */
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   SECURITY + CORE MIDDLEWARE
========================= */

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Fasyl PMO Backend Running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   API ROUTES
========================= */

// Authentication
app.use("/api/auth", authRoutes);

// Projects
app.use("/api/projects", projectRoutes);

/* =========================
   TEST PROTECTED ROUTE
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
   (Express 5 compatible)
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
  console.error("SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Fasyl PMO Backend running on port ${PORT}`);
});