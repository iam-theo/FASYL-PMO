import { Router } from "express";
import { authMiddleWare } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/rbac.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { upload } from "../../middleware/upload.middleware.js";

import {
   createProject,
   getProjects,
   getProject,
   updateProject,
   deleteProject,
   updateChecklistBulk,
   uploadStageDocument,
} from "./project.controller.js";

import { uploadLimiter, writeLimiter } from "../../middleware/rateLimit.middleware.js";

const router = Router();

/* =========================================
   CREATE PROJECT
========================================= */
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new PMO project with workflow initialization
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: ERP System Upgrade
 *
 *               clientName:
 *                 type: string
 *                 example: Fasyl Finance Ltd
 *
 *               industry:
 *                 type: string
 *                 example: Financial Technology
 *
 *               productName:
 *                 type: string
 *                 example: ERP Core Platform
 *
 *               description:
 *                 type: string
 *                 example: Internal ERP modernization project
 *
 *               projectManagerEmail:
 *                 type: string
 *                 format: email
 *                 example: pm1@fasyl.com
 *                 description: Email of assigned project manager
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
   "/",
   writeLimiter,
   authMiddleWare,
   allowRoles(ROLES.HEADOFOPS),
   createProject
);

/* =========================================
   GET ALL PROJECTS
========================================= */
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get projects (role-based filtering applied)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 */
router.get("/", authMiddleWare, allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER), getProjects);

/* =========================================
   GET SINGLE PROJECT
========================================= */
router.get(
   "/:id",
   authMiddleWare,
   allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
   getProject
);

/* =========================================
   UPDATE PROJECT
========================================= */
router.put(
   "/:id",
   writeLimiter,
   authMiddleWare,
   allowRoles(ROLES.HEADOFOPS),
   updateProject
);

/* =========================================
   UPDATE CHECKLIST
========================================= */
router.patch(
   "/:projectId/stages/:stageId/checklist",
   writeLimiter,
   authMiddleWare,
   allowRoles(ROLES.PROJECTMANAGER),
   updateChecklistBulk
);

/* =========================================
   UPLOAD DOCS
========================================= */
router.patch(
   "/:projectId/stages/:stageId/docs/:docKey",
   authMiddleWare,
   uploadLimiter,
   allowRoles(ROLES.PROJECTMANAGER, ROLES.HEADOFOPS),
   upload.single("file"),
   uploadStageDocument
);


/* =========================================
   DELETE PROJECT
========================================= */
router.delete(
   "/:id",
   writeLimiter,
   authMiddleWare,
   allowRoles(ROLES.HEADOFOPS),
   deleteProject
);

export default router;