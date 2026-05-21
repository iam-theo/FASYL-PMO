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
    const { projectId, stageId } = req.params;
    const userId = req.user.id;

    const stageState = await workflowService.getStageState(
      Number(projectId),
      Number(stageId)
    );

    const stageData = stageState.stageData;

    if (!policy.canSubmitStage(
      Number(stageId),
      stageData,
      req.user.role
    )) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to submit this stage",
      });
    }

    const result = await workflowService.submitStage({
      projectId: Number(projectId),
      stageId: Number(stageId),
      userId,
    });

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
 * APPROVE STAGE
 * =========================
 */
export const approveStage = async (req, res) => {
  try {
    const { projectId, stageId } = req.params;
    const userId = req.user.id;

    if (!policy.canApproveStage(
      Number(stageId),
      req.user.role
    )) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to approve this stage",
      });
    }

    const result = await workflowService.approveStage({
      projectId: Number(projectId),
      stageId: Number(stageId),
      userId,
    });

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
 * REJECT STAGE
 * =========================
 */
export const rejectStage = async (req, res) => {
  try {
    const { projectId, stageId } = req.params;
    const { reason } = req.body;

    const userId = req.user.id;

    if (!policy.canApproveStage(
      Number(stageId),
      req.user.role
    )) {
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
      projectId: Number(projectId),
      stageId: Number(stageId),
      userId,
      reason,
    });

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