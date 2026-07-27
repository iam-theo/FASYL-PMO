const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { getStageModel } = require("./workflow.utils");
const { getPolicy } = require("../workflow/workflow.policy");
const { WorkflowStatus } = require("@prisma/client");

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
const validateStage = (stageId, stageData) => {
  const policy = getPolicy(stageId);

  if (!stageData?.checklist) return false;

  const checklistValid = policy.checklist.every((policyItem) => {
    const item = stageData.checklist.find(
      (c) => c.key === policyItem.key
    );

    if (policyItem.isRequired) {
      return item?.completed === true;
    }

    return true;
  });

  const docsValid =
    !policy.requiredDocs?.length ||
    policy.requiredDocs.every((docKey) =>
      (stageData.requiredDocs || []).some(
        (d) => d.key === docKey && d.fileURL
      )
    );

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

  if (!validateStage(stageId, stageData))  {
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
      workflowStatus: WorkflowStatus.SUBMITTED
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

  const nextStage = stageId >= TOTAL_STAGES ? stageId : stageId + 1;


  /**
   * 1. Update Stage Table
   */
  await prisma[model].update({
    where: { projectId },
    data: {
      approvedAt: new Date(),
      approvedBy: userId,
      workflowStatus: WorkflowStatus.APPROVED,
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
      workflowStatus: WorkflowStatus.APPROVED,
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
      workflowStatus: WorkflowStatus.REJECTED
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
      workflowStatus: WorkflowStatus.REJECTED
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