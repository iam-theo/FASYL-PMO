import express from "express";
import { authMiddleWare } from "../../middleware/auth.middleware.js";

import {
  submitStage,
  approveStage,
  rejectStage,
  getStageState
} from "./workflow.controller.js";

const router = express.Router();

/* =========================================
   WORKFLOW ROUTES (SWAGGER)
========================================= */

/**
 * @swagger
 * /workflow/submit/{projectId}/{stageId}:
 *   post:
 *     summary: Submit a project stage for approval
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: path
 *         name: stageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workflow stage ID
 *     responses:
 *       200:
 *         description: Stage submitted successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/submit/:projectId/:stageOrder",
  authMiddleWare,
  submitStage
);

/**
 * @swagger
 * /workflow/approve/{projectId}/{stageId}:
 *   post:
 *     summary: Approve a workflow stage (HEAD OF OPS)
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: stageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stage approved successfully
 *       403:
 *         description: Forbidden (insufficient role)
 */
router.post(
  "/approve/:projectId/:stageOrder",
  authMiddleWare,
  approveStage
);

/**
 * @swagger
 * /workflow/reject/{projectId}/{stageId}:
 *   post:
 *     summary: Reject workflow stage
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: stageId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Missing financial approval"
 *     responses:
 *       200:
 *         description: Stage rejected successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/reject/:projectId/:stageOrder",
  authMiddleWare,
  rejectStage
);

/**
 * @swagger
 * /workflow/{projectId}:
 *   get:
 *     summary: Get full workflow status for a project
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Workflow status retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get(
  "/:projectId/stage/:stageId",
  authMiddleWare,
  getStageState
);
export default router;