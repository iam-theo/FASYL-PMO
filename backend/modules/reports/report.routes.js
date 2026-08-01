// import express from "express";

// import {
//   createReport,
//   getReports,
//   getReport,
//   getReportsByProject,
//   getReportsByStage,
//   updateReport,
//   deleteReport,
// } from "./report.controller.js";

// const router = express.Router();

// /**
//  * Create / Generate Report
//  * POST /api/v1/reports
//  */
// router.post("/", createReport);

// /**
//  * Get All Generated Reports
//  * GET /api/v1/reports
//  */
// router.get("/", getReports);

// /**
//  * Get Reports By Project
//  * GET /api/v1/reports/project/:projectId
//  */
// router.get("/project/:projectId", getReportsByProject);

// /**
//  * Get Reports By Stage
//  * GET /api/v1/reports/stage/:stageId
//  */
// router.get("/stage/:stageId", getReportsByStage);

// /**
//  * Get Single Report
//  * GET /api/v1/reports/:id
//  */
// router.get("/:id", getReport);

// /**
//  * Update Generated Report
//  * PATCH /api/v1/reports/:id
//  */
// router.patch("/:id", updateReport);

// /**
//  * Delete Generated Report
//  * DELETE /api/v1/reports/:id
//  */
// router.delete("/:id", deleteReport);

// export default router;

import express from "express";

import {
  createReport,
  getReports,
  getReport,
  getReportsByProject,
  getReportsByStage,
  updateReport,
  deleteReport,
} from "./report.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Project report management and analytics
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Generate a new report
 *     description: Creates a generated project analytics report.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateReportRequest"
 *     responses:
 *       201:
 *         description: Report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Report"
 *       400:
 *         description: Validation error
 *       404:
 *         description: Project or stage not found
 *       500:
 *         description: Server error
 */
router.post("/", createReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports
 *     description: Retrieves all generated reports.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Report"
 *       500:
 *         description: Server error
 */
router.get("/", getReports);

/**
 * @swagger
 * /reports/project/{projectId}:
 *   get:
 *     summary: Get reports by project
 *     description: Retrieves all reports belonging to a project.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Report"
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get("/project/:projectId", getReportsByProject);

/**
 * @swagger
 * /reports/stage/{stageId}:
 *   get:
 *     summary: Get reports by stage
 *     description: Retrieves all reports for a project stage.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Stage ID
 *     responses:
 *       200:
 *         description: Stage reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Report"
 *       404:
 *         description: Stage not found
 *       500:
 *         description: Server error
 */
router.get("/stage/:stageId", getReportsByStage);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get a single report
 *     description: Retrieves a report by ID.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Report"
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getReport);

/**
 * @swagger
 * /reports/{id}:
 *   patch:
 *     summary: Update a report
 *     description: Updates report metadata or content.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Report ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateReportRequest"
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Report"
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", updateReport);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     description: Deletes a generated report.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteReport);

export default router;
