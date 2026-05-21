import { POLICY } from "../workflow/workflow.policy.js";

/* =========================
   CREATE SINGLE STAGE
========================= */
const createStage = (projectId, stageNumber) => {
  const policy = POLICY[`stage_${stageNumber}`];

  return {
    projectId,
    stageIndex: stageNumber,
    stageName: policy.name,

    workflowStatus:
      stageNumber === 1 ? "OPEN" : "LOCKED",

    checklist: policy.checklist.map((item) => ({
      key: item.key,
      title: item.title,
      desc: item.desc,
      isRequired: item.isRequired,
      completed: false,
      completedAt: null,
    })),

    documents: [],

    completed: false,
    completedAt: null,

    submittedAt: null,
    submittedBy: null,

    approvedAt: null,
    approvedBy: null,

    rejectedAt: null,
    rejectedBy: null,
    rejectionReason: null,

    escalated: false,
    escalatedAt: null,
    escalatedBy: null,
  };
};

/* =========================
   INIT ALL PROJECT STAGES
========================= */
export const initStages = (projectId) => {
  return Array.from({ length: 8 }, (_, index) =>
    createStage(projectId, index + 1)
  );
};