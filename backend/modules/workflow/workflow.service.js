import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * =========================
 * SUBMIT STAGE
 * =========================
 */
export const submitStage = async ({ projectId, stageId, userId }) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) throw new Error("Project not found");

  const existingApproval = await prisma.projectApproval.findFirst({
    where: {
      projectId,
      stage: stageId,
      status: "PENDING"
    }
  });

  if (existingApproval) {
    throw new Error("Stage already submitted for approval");
  }

  await prisma.projectApproval.create({
    data: {
      projectId,
      stage: stageId,
      status: "PENDING",
      approvedBy: null,
      stageModel: `stage_${stageId}`
    }
  });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      workflowStatus: "SUBMITTED"
    }
  });

  return prisma.project.findUnique({
    where: { id: projectId }
  });
};

/**
 * =========================
 * APPROVE STAGE
 * =========================
 */
export const approveStage = async ({ projectId, stageId, userId }) => {
  const nextStage = stageId + 1;

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId,
      stage: stageId,
      status: "PENDING"
    }
  });

  if (!approval) {
    throw new Error("No pending approval found for this stage");
  }

  await prisma.projectApproval.update({
    where: { id: approval.id },
    data: {
      status: "APPROVED",
      approvedBy: userId,
      updatedAt: new Date()
    }
  });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      currentStage: nextStage,
      workflowStatus: "APPROVED"
    }
  });

  return prisma.project.findUnique({
    where: { id: projectId }
  });
};

/**
 * =========================
 * REJECT STAGE
 * =========================
 */
export const rejectStage = async ({ projectId, stageId, userId, reason }) => {
  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId,
      stage: stageId,
      status: "PENDING"
    }
  });

  if (!approval) {
    throw new Error("No pending approval found for this stage");
  }

  await prisma.projectApproval.update({
    where: { id: approval.id },
    data: {
      status: "REJECTED",
      approvedBy: userId,
      comment: reason,
      updatedAt: new Date()
    }
  });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      workflowStatus: "REJECTED"
    }
  });

  return prisma.project.findUnique({
    where: { id: projectId }
  });
};

/**
 * =========================
 * GET STAGE STATE (UI SYNC)
 * =========================
 */
export const getStageState = async (projectId, stageId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      approvals: true
    }
  });

  if (!project) throw new Error("Project not found");

  const stageApproval = project.approvals.find(
    (a) => a.stage === stageId
  );

  return {
    project,
    stageApproval: stageApproval || null
  };
};

/**
 * =========================
 * DEFAULT EXPORT (OPTIONAL)
 * =========================
 */
export default {
  submitStage,
  approveStage,
  rejectStage,
  getStageState
};