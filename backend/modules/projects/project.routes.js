import { Router } from "express";
import { authMiddleWare } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/rbac.middleware.js";
import { ROLES } from "../../constants/roles.js";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "./project.controller.js";

const router = Router();

/* =========================================
   CREATE PROJECT (PMO FULL WORKFLOW INPUT)
========================================= */
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new PMO project with full workflow initialization
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - clientName
 *               - industry
 *               - productName
 *               - projectManager
 *             properties:
 *               name:
 *                 type: string
 *                 example: ERP System Upgrade

 *               clientName:
 *                 type: string
 *                 example: Fasyl Finance Ltd

 *               industry:
 *                 type: string
 *                 example: Financial Technology

 *               productName:
 *                 type: string
 *                 example: ERP Core Platform

 *               projectManager:
 *                 type: string
 *                 example: John Doe

 *               description:
 *                 type: string
 *                 example: Internal ERP modernization project
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error (missing required fields)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (RBAC)
 */
router.post(
  "/",
  authMiddleWare,
  allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
  createProject
);

/* =========================================
   GET ALL PROJECTS
========================================= */
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects in PMO system
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleWare, getProjects);

/* =========================================
   GET SINGLE PROJECT
========================================= */
/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID with full workflow stages
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get("/:id", authMiddleWare, getProject);

/* =========================================
   UPDATE PROJECT (PARTIAL UPDATE SAFE)
========================================= */
/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update project details (partial update supported)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Project Name
 *               clientName:
 *                 type: string
 *               industry:
 *                 type: string
 *               productName:
 *                 type: string
 *               projectManager:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 */
router.put(
  "/:id",
  authMiddleWare,
  allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
  updateProject
);

/* =========================================
   DELETE PROJECT (HARD DELETE CONTROLLED)
========================================= */
/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project (HEADOFOPS only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       403:
 *         description: Forbidden (only HEADOFOPS)
 *       404:
 *         description: Project not found
 */
router.delete(
  "/:id",
  authMiddleWare,
  allowRoles(ROLES.HEADOFOPS),
  deleteProject
);

export default router;