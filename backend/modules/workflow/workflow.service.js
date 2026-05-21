import { PrismaClient, WorkflowStatus } from "@prisma/client";

const prisma = new PrismaClient();

// ensure consistent types everywhere
const normalizeIds = (projectId, stageId) => {
  return {
    projectId: Number(projectId),
    stageId: Number(stageId),
  };
};

/**
 * =========================
 * GET PROJECT (SAFE)
 * =========================
 */
const getProjectOrThrow = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");
  return project;
};

/**
 * =========================
 * GET STAGE STATE
 * =========================
 */
export const getStageState = async (projectId, stageId) => {
  const { projectId: pid, stageId: sid } = normalizeIds(projectId, stageId);

  const [project, stage, approval] = await Promise.all([
    prisma.project.findUnique({
      where: { id: pid },
    }),

    prisma.projectStage.findUnique({
      where: {
        projectId_stageIndex: {
          projectId: pid,
          stageIndex: sid,
        },
      },
    }),

    prisma.projectApproval.findFirst({
      where: {
        projectId: pid,
        stage: sid,
      },
    }),
  ]);

  if (!project) throw new Error("Project not found");

  return {
    project,
    stageData: stage,
    stageApproval: approval || null,
    isActiveStage: project.currentStage === sid,
    canSubmit: project.currentStage === sid,
  };
};


/**
 * =========================
 * SUBMIT STAGE
 * =========================
 */
export const submitStage = async ({ projectId, stageId, userId }) => {

  const { projectId: pid, stageId: sid } = normalizeIds(projectId, stageId);

  const project = await getProjectOrThrow(pid);

  // enforce correct stage flow
  if (project.currentStage !== sid) {
    throw new Error("You can only submit the current active stage");
  }

  // check if already submitted
  const existing = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: sid,
      status: "PENDING",
    },
  });

  if (existing) {
    throw new Error("Stage already submitted for approval");
  }

  // create approval record
  await prisma.projectApproval.create({
    data: {
      projectId: pid,
      stage: sid,
      status: "PENDING",
      submittedBy: userId,
      stageModel: `stage_${sid}`,
    },
  });

  // update project state
  await prisma.project.update({
    where: { id: pid },
    data: {
      workflowStatus: WorkflowStatus.SUBMITTED,
    },
  });

  return getProjectOrThrow(pid);
};

/**
 * =========================
 * APPROVE STAGE
 * =========================
 */
export const approveStage = async ({ projectId, stageId, userId }) => {

  const { projectId: pid, stageId: sid } = normalizeIds(projectId, stageId);

  const project = await getProjectOrThrow(pid);

  const nextStage = sid + 1;

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: sid,
      status: "PENDING",
    },
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
    where: { id: pid },
    data: {
      currentStage: nextStage,
      workflowStatus: WorkflowStatus.APPROVED,
      progressPercent: Math.round((nextStage / 8) * 100)
    }
  });

  return getProjectOrThrow(pid);
};

/**
 * =========================
 * REJECT STAGE
 * =========================
 */
export const rejectStage = async ({ projectId, stageId, userId, reason }) => {

  const { projectId: pid, stageId: sid } = normalizeIds(projectId, stageId);

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: sid,
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
      rejectedBy: userId,
      comment: reason,
      updatedAt: new Date()
    }
  });

  await prisma.project.update({
    where: { id: pid },
    data: {
      workflowStatus: WorkflowStatus.REJECTED
    }
  });

  return getProjectOrThrow(pid);
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