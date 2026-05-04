import express from "express";
import { authMiddleWare } from "../../middleware/auth.middleware.js";

import {
  submitStage,
  approveStage,
  rejectStage,
  escalateStage,
  getWorkflowStatus,
} from "./workflow.controller.js";

const router = express.Router();

/* =========================================
   WORKFLOW ROUTES (SWAGGER)
========================================= */

/**
 * @swagger
 * /workflow/submit/{projectId}/{stage}:
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
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: stage
 *         required: true
 *         schema:
 *           type: string
 *         description: Workflow stage name
 *     responses:
 *       200:
 *         description: Stage submitted successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/submit/:projectId/:stage",
  authMiddleWare,
  submitStage
);

/**
 * @swagger
 * /workflow/approve/{projectId}/{stage}:
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
 *           type: string
 *       - in: path
 *         name: stage
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stage approved successfully
 *       403:
 *         description: Forbidden (insufficient role)
 */
router.post(
  "/approve/:projectId/:stage",
  authMiddleWare,
  approveStage
);

/**
 * @swagger
 * /workflow/reject/{projectId}/{stage}:
 *   post:
 *     summary: Reject workflow stage
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *       - in: path
 *         name: stage
 *         required: true
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
  "/reject/:projectId/:stage",
  authMiddleWare,
  rejectStage
);

/**
 * @swagger
 * /workflow/escalate/{projectId}/{stage}:
 *   post:
 *     summary: Escalate a workflow stage to higher authority
 *     tags: [Workflow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stage
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stage escalated successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/escalate/:projectId/:stage",
  authMiddleWare,
  escalateStage
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
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Workflow status retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get(
  "/:projectId",
  authMiddleWare,
  getWorkflowStatus
);

export default router;