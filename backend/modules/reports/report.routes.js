import express from "express";

import {
    createReport,
    getReports,
    getReport,
    getReportsByProject,
    getReportsByStage,
    updateReport,
    deleteReport
} from "./report.controller.js";

const router = express.Router();

/**
 * Create / Generate Report
 * POST /api/v1/reports
 */
router.post("/", createReport);

/**
 * Get All Generated Reports
 * GET /api/v1/reports
 */
router.get("/", getReports);

/**
 * Get Reports By Project
 * GET /api/v1/reports/project/:projectId
 */
router.get("/project/:projectId", getReportsByProject);

/**
 * Get Reports By Stage
 * GET /api/v1/reports/stage/:stageId
 */
router.get("/stage/:stageId", getReportsByStage);

/**
 * Get Single Report
 * GET /api/v1/reports/:id
 */
router.get("/:id", getReport);

/**
 * Update Generated Report
 * PATCH /api/v1/reports/:id
 */
router.patch("/:id", updateReport);

/**
 * Delete Generated Report
 * DELETE /api/v1/reports/:id
 */
router.delete("/:id", deleteReport);

export default router;
