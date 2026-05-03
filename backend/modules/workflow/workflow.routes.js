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
   WORKFLOW ACTION ROUTES (STAGE-BASED)
========================================= */

// Submit stage for approval
router.post(
  "/submit/:projectId/:stage",
  authMiddleWare,
  submitStage
);

// Approve stage (HEAD OF OPS)
router.post(
  "/approve/:projectId/:stage",
  authMiddleWare,
  approveStage
);

// Reject stage
router.post(
  "/reject/:projectId/:stage",
  authMiddleWare,
  rejectStage
);

// Escalate stage
router.post(
  "/escalate/:projectId/:stage",
  authMiddleWare,
  escalateStage
);

/* =========================================
   GET FULL WORKFLOW STATE
========================================= */
router.get(
  "/:projectId",
  authMiddleWare,
  getWorkflowStatus
);

export default router;