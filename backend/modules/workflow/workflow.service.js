import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================================
   STAGE MODEL RESOLVER (SAFE + CLEAN)
========================================= */
const getStageModel = (stage) => {
  const map = {
    2: "stage2ClientEngagement",
    3: "stage3Initiation",
    4: "stage4Planning",
    5: "stage5Execution",
    6: "stage6UAT",
    7: "stage7GoLive",
    8: "stage8Closure",
  };

  const modelName = map[stage];
  if (!modelName) return null;

  return prisma[modelName];
};

/* =========================================
   NEXT STAGE CALCULATOR
========================================= */
const getNextStage = (stage) => (stage < 8 ? stage + 1 : null);

/* =========================================
   PROJECT VALIDATION
========================================= */
const assertProject = (project, stage) => {
  if (!project) throw new Error("Project not found");

  if (project.currentStage !== stage) {
    throw new Error(
      `Invalid stage action. Project is currently at stage ${project.currentStage}`
    );
  }
};

/* =========================================
   AUDIT LOGGER
========================================= */
const logAudit = async (tx, { projectId, userId, action, details }) => {
  return tx.auditLog.create({
    data: {
      projectId,
      userId: userId || null,
      module: "WORKFLOW_ENGINE",
      action,
      details,
    },
  });
};

/* =========================================
   PROJECT STATE SYNC
========================================= */
const syncProject = async (tx, projectId, stage, workflowStatus) => {
  const progress = (stage / 8) * 100;

  return tx.project.update({
    where: { id: projectId },
    data: {
      currentStage: stage,
      status: `stage_${stage}`,
      progressPercent: progress,
      workflowStatus,
    },
  });
};

/* =========================================
   SUBMIT STAGE
========================================= */
export const submitStageService = async (projectId, stage, user) => {
  const model = getStageModel(stage);
  if (!model) throw new Error("Invalid stage");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProject(project, stage);

  return prisma.$transaction(async (tx) => {
    await model.update({
      where: { projectId },
      data: {
        workflowStatus: "SUBMITTED",
        submittedBy: user.userId,
        submittedAt: new Date(),
      },
    });

    await logAudit(tx, {
      projectId,
      userId: user.userId,
      action: "STAGE_SUBMITTED",
      details: `Stage ${stage} submitted for approval`,
    });

    return {
      message: `Stage ${stage} submitted successfully`,
    };
  });
};

/* =========================================
   APPROVE STAGE
========================================= */
export const approveStageService = async (projectId, stage, user) => {
  const model = getStageModel(stage);
  const nextStage = getNextStage(stage);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProject(project, stage);

  return prisma.$transaction(async (tx) => {
    await model.update({
      where: { projectId },
      data: {
        workflowStatus: "APPROVED",
        approvedBy: user.userId,
        approvedAt: new Date(),
        completed: true,
        completedAt: new Date(),
      },
    });

    await syncProject(
      tx,
      projectId,
      nextStage || stage,
      nextStage ? "IN_PROGRESS" : "COMPLETED"
    );

    await logAudit(tx, {
      projectId,
      userId: user.userId,
      action: "STAGE_APPROVED",
      details: `Stage ${stage} approved → ${nextStage || "FINAL"}`,
    });

    return {
      message: `Stage ${stage} approved`,
      nextStage,
    };
  });
};

/* =========================================
   REJECT STAGE
========================================= */
export const rejectStageService = async (
  projectId,
  stage,
  reason,
  user
) => {
  if (!reason) throw new Error("Rejection reason is required");

  const model = getStageModel(stage);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProject(project, stage);

  return prisma.$transaction(async (tx) => {
    await model.update({
      where: { projectId },
      data: {
        workflowStatus: "REJECTED",
        rejectedBy: user.userId,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: {
        workflowStatus: "REJECTED",
      },
    });

    await logAudit(tx, {
      projectId,
      userId: user.userId,
      action: "STAGE_REJECTED",
      details: `Stage ${stage} rejected: ${reason}`,
    });

    return {
      message: `Stage ${stage} rejected`,
    };
  });
};

/* =========================================
   ESCALATE STAGE
========================================= */
export const escalateStageService = async (projectId, stage, user) => {
  const model = getStageModel(stage);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  assertProject(project, stage);

  return prisma.$transaction(async (tx) => {
    await model.update({
      where: { projectId },
      data: {
        escalated: true,
        escalatedBy: user.userId,
        escalatedAt: new Date(),
      },
    });

    await tx.escalation.create({
      data: {
        projectId,
        stage,
        reason: "Manual escalation",
        level: "HIGH",
      },
    });

    await logAudit(tx, {
      projectId,
      userId: user.userId,
      action: "STAGE_ESCALATED",
      details: `Stage ${stage} escalated`,
    });

    return {
      message: `Stage ${stage} escalated`,
    };
  });
};

/* =========================================
   WORKFLOW STATE FETCHER
========================================= */
export const getWorkflowStatusService = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      approvals: true,
      escalations: true,
      auditLogs: true,
    },
  });

  if (!project) throw new Error("Project not found");

  return {
    projectId: project.id,
    currentStage: project.currentStage,
    status: project.status,
    workflowStatus: project.workflowStatus,
    progress: project.progressPercent,
    approvals: project.approvals,
    escalations: project.escalations,
    auditLogs: project.auditLogs,
  };
};