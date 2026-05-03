import { PrismaClient } from "@prisma/client";
import { getWorkflowStatusFromStage } from "./workflow.utils.js";

const prisma = new PrismaClient();

/* =========================================
   HELPERS
========================================= */

const assertProjectExists = (project) => {
  if (!project) throw new Error("Project not found");
};

const assertStageMatch = (project, stage) => {
  if (project.currentStage !== stage) {
    throw new Error(
      `Invalid stage. Project is currently at stage ${project.currentStage}`
    );
  }
};

const getNextStage = (stage) => (stage < 8 ? stage + 1 : 8);

const logAudit = async ({ projectId, userId, action, details }) => {
  return prisma.auditLog.create({
    data: {
      projectId,
      userId: userId || null,
      module: "WORKFLOW_ENGINE",
      action,
      details,
    },
  });
};

const updateProject = async ({
  projectId,
  stage,
  workflowStatus,
}) => {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      currentStage: stage,
      status: `stage_${stage}`,
      workflowStatus,
      progressPercent: (stage / 8) * 100,
    },
  });
};

/* =========================================
   SUBMIT STAGE
   (PM submits for approval)
========================================= */

export const submitStageEngine = async (projectId, stage, userId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProjectExists(project);
  assertStageMatch(project, stage);

  // prevent duplicate submission
  const existing = await prisma.projectApproval.findFirst({
    where: { projectId, stage },
  });

  if (existing && existing.status === "PENDING") {
    throw new Error("Stage already submitted");
  }

  await prisma.projectApproval.upsert({
    where: {
      id: existing?.id || 0,
    },
    update: {
      status: "PENDING",
    },
    create: {
      projectId,
      stage,
      status: "PENDING",
    },
  });

  await logAudit({
    projectId,
    userId,
    action: "STAGE_SUBMITTED",
    details: `Stage ${stage} submitted`,
  });

  return {
    message: "Stage submitted successfully",
  };
};

/* =========================================
   APPROVE STAGE
   (HEAD OF OPS ONLY)
========================================= */

export const approveStageEngine = async (projectId, stage, userId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProjectExists(project);
  assertStageMatch(project, stage);

  const nextStage = getNextStage(stage);

  // mark approval
  await prisma.projectApproval.updateMany({
    where: { projectId, stage },
    data: {
      status: "APPROVED",
      approvedBy: userId,
    },
  });

  // move workflow forward
  await updateProject({
    projectId,
    stage: nextStage,
    workflowStatus: getWorkflowStatusFromStage(nextStage),
  });

  await logAudit({
    projectId,
    userId,
    action: "STAGE_APPROVED",
    details: `Stage ${stage} → Stage ${nextStage}`,
  });

  return {
    message: "Stage approved",
    currentStage: nextStage,
  };
};

/* =========================================
   REJECT STAGE
========================================= */

export const rejectStageEngine = async (
  projectId,
  stage,
  reason,
  userId
) => {
  if (!reason) throw new Error("Rejection reason required");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProjectExists(project);
  assertStageMatch(project, stage);

  await prisma.projectApproval.updateMany({
    where: { projectId, stage },
    data: {
      status: "REJECTED",
      comment: reason,
    },
  });

  // IMPORTANT: do NOT break workflow state
  await updateProject({
    projectId,
    stage,
    workflowStatus: "IN_PROGRESS",
  });

  await logAudit({
    projectId,
    userId,
    action: "STAGE_REJECTED",
    details: `Stage ${stage} rejected: ${reason}`,
  });

  return {
    message: "Stage rejected",
    currentStage: stage,
  };
};

/* =========================================
   ESCALATE STAGE
========================================= */

export const escalateStageEngine = async (
  projectId,
  stage,
  userId,
  reason
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProjectExists(project);
  assertStageMatch(project, stage);

  await prisma.escalation.create({
    data: {
      projectId,
      stage,
      reason,
      level: "MEDIUM",
    },
  });

  await logAudit({
    projectId,
    userId,
    action: "STAGE_ESCALATED",
    details: `Stage ${stage} escalated: ${reason}`,
  });

  return {
    message: "Stage escalated successfully",
  };
};

/* =========================================
   WORKFLOW STATE FETCHER
========================================= */

export const getWorkflowStateEngine = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      approvals: true,
      escalations: true,
      auditLogs: true,
    },
  });

  assertProjectExists(project);

  return {
    projectId,
    currentStage: project.currentStage,
    status: project.status,
    workflowStatus: project.workflowStatus,
    progress: project.progressPercent,
    approvals: project.approvals,
    escalations: project.escalations,
  };
};