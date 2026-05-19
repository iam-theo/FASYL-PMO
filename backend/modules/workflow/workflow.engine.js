const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { getStageModel } = require("./workflow.utils");

/**
 * =====================================
 * GET STAGE DATA (SOURCE OF TRUTH)
 * =====================================
 */
exports.getStageData = async (projectId, stageId) => {
  const model = getStageModel(stageId);

  if (!model) throw new Error("Invalid stage mapping");

  return prisma[model].findUnique({
    where: { projectId }
  });
};

/**
 * =====================================
 * UPDATE STAGE DATA (CHECKLIST + DOCS)
 * =====================================
 */
exports.updateStageData = async (projectId, stageId, data) => {
  const model = getStageModel(stageId);

  if (!model) throw new Error("Invalid stage mapping");

  return prisma[model].update({
    where: { projectId },
    data
  });
};

/**
 * =====================================
 * VALIDATE STAGE BEFORE SUBMISSION
 * =====================================
 */
const validateStage = (stageData) => {
  if (!stageData) return false;

  // Checklist validation (dynamic safety)
  const checklistValid =
    !stageData.checklistRequired ||
    stageData.checklistRequired === true;

  // Document validation (if present)
  const docsValid =
    !stageData.requiredDocs ||
    stageData.requiredDocs.every(doc => doc.fileURL && doc.fileURL !== "");

  return checklistValid && docsValid;
};

/**
 * =====================================
 * CALCULATE PROJECT PROGRESS
 * =====================================
 */
const calculateProgress = (currentStage, totalStages = 8) => {
  return Math.round((currentStage / totalStages) * 100);
};

/**
 * =====================================
 * SUBMIT STAGE (PM ACTION)
 * =====================================
 */
exports.submitStage = async ({ projectId, stageId, userId }) => {
  const stageData = await this.getStageData(projectId, stageId);

  if (!validateStage(stageData)) {
    throw new Error("Stage validation failed. Complete checklist & uploads.");
  }

  await prisma.projectApproval.create({
    data: {
      projectId,
      stage: stageId,
      status: "PENDING",
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
 * =====================================
 * APPROVE STAGE (HEAD OF OPS)
 * =====================================
 */
exports.approveStage = async ({ projectId, stageId, userId }) => {
  const model = getStageModel(stageId);

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId,
      stage: stageId,
      status: "PENDING"
    }
  });

  if (!approval) {
    throw new Error("No pending approval found");
  }

  const nextStage = stageId + 1;

  /**
   * 1. Update Stage Table
   */
  await prisma[model].update({
    where: { projectId },
    data: {
      approvedAt: new Date(),
      approvedBy: userId,
      workflowStatus: "APPROVED",
      completed: true,
      completedAt: new Date()
    }
  });

  /**
   * 2. Update Approval Record
   */
  await prisma.projectApproval.update({
    where: { id: approval.id },
    data: {
      status: "APPROVED",
      approvedBy: userId,
      updatedAt: new Date()
    }
  });

  /**
   * 3. Update Project Master Record
   */
  await prisma.project.update({
    where: { id: projectId },
    data: {
      currentStage: nextStage,
      workflowStatus: "APPROVED",
      progressPercent: calculateProgress(nextStage)
    }
  });

  return prisma.project.findUnique({
    where: { id: projectId }
  });
};

/**
 * =====================================
 * REJECT STAGE (HEAD OF OPS)
 * =====================================
 */
exports.rejectStage = async ({ projectId, stageId, userId, reason }) => {
  const model = getStageModel(stageId);

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId,
      stage: stageId,
      status: "PENDING"
    }
  });

  if (!approval) {
    throw new Error("No pending approval found");
  }

  /**
   * 1. Update Stage Table
   */
  await prisma[model].update({
    where: { projectId },
    data: {
      rejectedAt: new Date(),
      rejectedBy: userId,
      rejectionReason: reason,
      workflowStatus: "REJECTED"
    }
  });

  /**
   * 2. Update Approval Record
   */
  await prisma.projectApproval.update({
    where: { id: approval.id },
    data: {
      status: "REJECTED",
      approvedBy: userId,
      comment: reason,
      updatedAt: new Date()
    }
  });

  /**
   * 3. Update Project Master Record
   */
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
 * =====================================
 * GET FULL STAGE STATE (FRONTEND USE)
 * =====================================
 */
exports.getFullStageState = async (projectId, stageId) => {
  const model = getStageModel(stageId);

  const [project, stageData, approval] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId } }),
    prisma[model].findUnique({ where: { projectId } }),
    prisma.projectApproval.findFirst({
      where: { projectId, stage: stageId }
    })
  ]);

  return {
    project,
    stageData,
    approval
  };
};