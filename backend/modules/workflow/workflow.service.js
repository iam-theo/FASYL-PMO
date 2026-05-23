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
    include: {
      stages: true,
      approvals: true, // 🔥 THIS IS MISSING IN YOUR SYSTEM
    },
  });

  if (!project) throw new Error("Project not found");
  return project;
};

/**
 * =========================
 * GET STAGE STATE
 * =========================
 */
export const getStageState = async (projectId, stageOrder) => {
  const pid = Number(projectId);
  const order = Number(stageOrder);

  const [project, stage, approval] = await Promise.all([
    prisma.project.findUnique({
      where: { id: pid },
    }),

    prisma.projectStage.findUnique({
      where: {
        projectId_stageOrder: {
          projectId: pid,
          stageOrder: order,
        },
      },
    }),

    prisma.projectApproval.findFirst({
      where: {
        projectId: pid,
        stage: order,
      },
    }),
  ]);

  if (!project) throw new Error("Project not found");

  if (!stage) throw new Error("Stage not found")

  return {
    project,
    stageData: stage,
    stageApproval: approval || null,
    isActiveStage: project.currentStageOrder === order,
    canSubmit: project.currentStageOrder === order,
  };
};


/**
 * =========================
 * SUBMIT STAGE
 * =========================
 */
export const submitStage = async ({ projectId, stageOrder, userId }) => {

  const pid = Number(projectId);
  const order = Number(stageOrder);
  const uid = Number(userId);

  const project = await getProjectOrThrow(pid)

  const stage = await prisma.projectStage.findFirst({
    where: { 
      projectId: pid,
      stageOrder: order 
    },
  });

  if (!stage) {
    throw new Error("Stage not found");
  }

  if (project.currentStageOrder !== order) {
    throw new Error("Invalid stage sequence");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const userEmail = user?.email;

  // enforce correct stage flow
  if (project.currentStageOrder !== order) {
    throw new Error("Invalid Stage Sequence");
  }
  console.log("Submitting stage:", { stageOrder: order, userId: userId });

  // check if already submitted
  const existingApproval = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: order,
      status: "PENDING",
    },
  });

  if (existingApproval) {
    throw new Error("Stage already submitted for approval");
  }

  // create approval record
  await prisma.projectApproval.create({
    data: {
      projectId: pid,
      stage: order,
      status: "PENDING",
      submittedBy: userEmail,
    },
  });

  // console.log("CREATED APPROVAL:", approval)

  // update project state
  await prisma.projectStage.update({
    where: { id: stage.id },
    data: {
      workflowStatus: WorkflowStatus.SUBMITTED,
      submittedAt: new Date(),
      submittedBy: userEmail,
    },
  });

  await prisma.project.update({
    where: {
      id: pid,
    },
    data: {
      workflowStatus: "SUBMITTED",
    },
  });

  return await prisma.project.findUnique({
    where: { id: pid },
    include: {
      stages: true,
      approvals: true,
    },
  });
};

/**
 * =========================
 * APPROVE STAGE
 * =========================
 */
export const approveStage = async ({ projectId, stageOrder, userId }) => {

  const pid = Number(projectId);
  const order = Number(stageOrder);

  const project = await getProjectOrThrow(pid);

  if (!project) throw new Error("Project not found");

  const stage = await prisma.projectStage.findFirst({
    where: {
      projectId: pid,
      stageOrder: order,
    },
  });

  if (!stage) throw new Error("Stage not found");

  const nextStage = order + 1;

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: order,
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
      currentStageOrder: nextStage,
      workflowStatus: WorkflowStatus.APPROVED,
      progressPercent: Math.round((nextStage / 8) * 100)
    }
  });

  await prisma.projectStage.update({
    where: { id: stage.id },
    data: {
      approvedAt: new Date(),
      approvedBy: userId
    }
  });

  return prisma.project.findUnique({
    where: { id: pid },
    include: { stages: true },
  });
};

/**
 * =========================
 * REJECT STAGE
 * =========================
 */
export const rejectStage = async ({ projectId, stageOrder, userId, reason }) => {

  const pid = Number(projectId);
  const order = Number(stageOrder);

  const project = await getProjectOrThrow(pid);

  if (!project) {
    throw new Error("Project not found");
  }

  const stage = await prisma.projectStage.findFirst({
    where: {
      projectId: pid,
      stageOrder: order,
    },
  });

  if (!stage) {
    throw new Error("Stage not found");
  }

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: order,
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

  await prisma.projectStage.update({
    where: {
      id: stage.id,
    },

    data: {
      workflowStatus: WorkflowStatus.REJECTED,
      rejectedAt: new Date(),
      rejectedBy: userId,
      rejectionReason: reason,
    },
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