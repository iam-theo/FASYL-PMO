import { PrismaClient, WorkflowStatus } from "@prisma/client";
import { canApproveStage } from "./workflow.policy.js";

const prisma = new PrismaClient();

import workflowService from "./workflow.service.js";
import * as policy from "./workflow.policy.js";
// import { getPolicy } from "./workflow.policy.js";
/**
 * =========================
 * GET STAGE STATE
 * =========================
 */
export const getStageState = async (req, res) => {
  try {
    const { projectId, stageId } = req.params;

    const result = await workflowService.getStageState(
      Number(projectId),
      Number(stageId)
    );

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * =========================
 * SUBMIT STAGE
 * =========================
 */
export const submitStage = async (req, res) => {
  try {
    const { projectId, stageOrder } = req.params;

    const userId = req.user.id;

    const stage = await prisma.projectStage.findFirst({
      where: {
        projectId: Number(projectId),
        stageOrder: Number(stageOrder),
      },
    });

    if (!stage) {
      return res.status(404).json({
        success: false,
        message: "Stage not found",
      });
    }

    const stageKey = stage.stageKey;

    const stageState = await workflowService.getStageState(
      Number(projectId),
      Number(stageOrder)
    );

    const stageData = stageState?.stageData || {};

    const allowed = policy.canSubmitStage(
      stageKey,
      stageData,
      req.user.role
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to submit this stage",
      });
    }

    const result = await workflowService.submitStage({
      projectId: Number(projectId),
      stageOrder: Number(stageOrder),
      userId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error("Submit Stage Error:", err)

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * =========================
 * APPROVE STAGE
 * =========================
 */
export const approveStage = async (req, res) => {
  try {
    const { projectId, stageOrder } = req.params;
    const userId = req.user.id;

    const pid = Number(projectId);
    const order = Number(stageOrder);

    const stage = await prisma.projectStage.findFirst({
      where: {
        projectId: pid,
        stageOrder: order,
      },
    });

    if (!stage) {
      return res.status(404).json({
        success: false,
        message: "Stage not found",
      });
    }

    const allowed = canApproveStage(
      stage.stageKey,
      stage,              // stageData (can be enriched later)
      req.user.role
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to approve this stage",
      });
    }

    const result = await workflowService.approveStage({
      projectId: pid,
      stageOrder: order,
      userId,
    });

    return res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.log("🔥 FULL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};

/**
 * =========================
 * REJECT STAGE
 * =========================
 */
export const rejectStage = async (req, res) => {
  try {
    const { projectId, stageOrder } = req.params;
    const { reason } = req.body;

    const userId = req.user.id;

    const pid = Number(projectId);
    const order = Number(stageOrder);

    const stage = await prisma.projectStage.findFirst({
      where: {
        projectId: pid,
        stageOrder: order,
      },
    });

    if (!stage) {
      return res.status(404).json({
        success: false,
        message: "Stage not found",
      });
    }

    const allowed = policy.canApproveStage(
      stage.stageKey,
      stage,
      req.user.role
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to reject this stage",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const result = await workflowService.rejectStage({
      projectId: pid,
      stageOrder: order,
      userId,
      reason,
    });

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error("Reject Stage Error:", err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};