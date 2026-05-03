import {
  submitStageService,
  approveStageService,
  rejectStageService,
  escalateStageService,
  getWorkflowStatusService,
} from "./workflow.service.js";

/* =========================
   GET FULL WORKFLOW STATUS
========================= */
export const getWorkflowStatus = async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await getWorkflowStatusService(Number(projectId));

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   SUBMIT STAGE (PM ONLY)
========================= */
export const submitStage = async (req, res) => {
  try {
    const { projectId, stage } = req.params;

    const result = await submitStageService(
      Number(projectId),
      Number(stage),
      req.user
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   APPROVE STAGE (HEAD OF OPS ONLY)
========================= */
export const approveStage = async (req, res) => {
  try {
    const { projectId, stage } = req.params;

    // RBAC guard
    if (req.user.role !== "HEADOFOPS") {
      return res.status(403).json({
        success: false,
        error: "Only HEAD OF OPS can approve stages",
      });
    }

    const result = await approveStageService(
      Number(projectId),
      Number(stage),
      req.user
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   REJECT STAGE
========================= */
export const rejectStage = async (req, res) => {
  try {
    const { projectId, stage } = req.params;
    const { reason } = req.body;

    const result = await rejectStageService(
      Number(projectId),
      Number(stage),
      reason,
      req.user
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   ESCALATE STAGE
========================= */
export const escalateStage = async (req, res) => {
  try {
    const { projectId, stage } = req.params;

    const result = await escalateStageService(
      Number(projectId),
      Number(stage),
      req.user
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};