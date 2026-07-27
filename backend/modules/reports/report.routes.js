import express from "express";

import {
  createReport,
  getReports,
  getReport,
  getReportsByProject,
  getReportsByStage,
  updateReport,
  submitReport,
  approveReport,
  rejectReport,
  deleteReport
} from "./report.controller.js";

const router = express.Router();

// Create report
router.post("/", createReport);

// Get all reports
router.get("/", getReports);

// Get reports by project
router.get("/project/:projectId", getReportsByProject);

// Get reports by stage
router.get("/stage/:stageId", getReportsByStage);

// Get single report
router.get("/:id", getReport);

// Update report
router.patch("/:id", updateReport);

// Submit report
router.post("/:id/submit", submitReport);

// Approve report
router.post("/:id/approve", approveReport);

// Reject report
router.post("/:id/reject", rejectReport);

// Delete report
router.delete("/:id", deleteReport);

export default router;