import { PrismaClient, WorkflowStatus } from "@prisma/client";

const prisma = new PrismaClient();

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
      approvals: true,
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
      include: {
        stages: true,
        approvals: true,
      }
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
export const submitStage = async ({
  projectId,
  stageOrder,
  userId,
}) => {

  const pid = Number(projectId);
  const order = Number(stageOrder);
  const uid = Number(userId);

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

  if (project.currentStageOrder !== order) {
    throw new Error("Invalid stage sequence");
  }

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: order,
      status: {
        in: ["PENDING", "REJECTED"]
      }, 
    },
  });

  if (!approval) {
    throw new Error("Approval record not found");
  }


  await prisma.projectStage.update({
    where: {
      id: stage.id,
    },
    data: {
      workflowStatus: "SUBMITTED",
      submittedAt: new Date(),
      submittedBy: uid, 
    },
  });

  await prisma.projectStage.updateMany({
    where: {
      stageOrder: order + 1,
    },
    data: {
      workflowStatus: "OPEN",
    },
  });


  await prisma.projectApproval.update({
    where: {
      id: approval.id,
    },
    data: {
      status: "SUBMITTED", 
      submittedBy: uid, 
      updatedAt: new Date(),
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
        stages: {
            orderBy: {
                stageOrder: "asc"
            }
        },

        approvals: {
            orderBy: {
                stage: "asc"
            }
        },

        projectManager: true,
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
  const uid = Number(userId)

  const project = await getProjectOrThrow(pid);

  if (!project) throw new Error("Project not found");

  const stage = await prisma.projectStage.findFirst({
    where: {
      projectId: pid,
      stageOrder: order,
    },
  });

  if (!stage) throw new Error("Stage not found");

  const isFinalStage = order === 8; 

  const approval = await prisma.projectApproval.findFirst({
    where: {
      projectId: pid,
      stage: order,
      status: "SUBMITTED", 
    },
  });

  console.log("APPROVAL:", approval.status)

  if (!approval) {
    throw new Error("No pending approval found for this stage");
  }

  await prisma.projectApproval.update({
    where: { id: approval.id },
    data: {
      status: "APPROVED",
      approvedBy: uid, 
      updatedAt: new Date()
    }
  });


  if(!isFinalStage) { 
    const nextStage = order + 1;
    await prisma.projectStage.update({
      where: { id: stage.id },
      data: {
        workflowStatus: "APPROVED",
        approvedAt: new Date(),
        approvedBy: uid 
      }
    });

    await prisma.project.update({
      where: { id: pid },
      data: {
        currentStageOrder: nextStage,
        workflowStatus: "APPROVED",
        progressPercent: Math.round((nextStage / 8) * 100)
      }
    });
  } else {
      await prisma.projectStage.update({
      where: { id: stage.id },
      data: {
        workflowStatus: "COMPLETED",
        completedAt: new Date(),
        completed: true 
      }
    });

    await prisma.project.update({
      where: { id: pid },
      data: {
        currentStageOrder: order,
        workflowStatus: "COMPLETED",
        progressPercent: Math.round((order / 8) * 100)
      }
    });
  }

  return await prisma.project.findUnique({
    where: { id: pid },

    include: {
        stages: {
            orderBy: {
                stageOrder: "asc"
            }
        },

        approvals: {
            orderBy: {
                stage: "asc"
            }
        },

        projectManager: true,
    },
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
  const uid = Number(userId)

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
      status: "SUBMITTED" 
    }
  });

  if (!approval) {
    throw new Error("No pending approval found for this stage");
  }

  await prisma.projectApproval.update({
    where: { id: approval.id },
    data: {
      status: "REJECTED",
      rejectedBy: uid, 
      comment: reason,
      updatedAt: new Date()
    }
  });

  await prisma.projectStage.update({
    where: { id: stage.id },
    data: {
      workflowStatus: "REJECTED",
      rejectedAt: new Date(),
      rejectedBy: uid, 
    },
  });

  await prisma.project.update({
    where: {
      id: pid,
    },
    data: {
      workflowStatus: "REJECTED",
    },
  });

  return await prisma.project.findUnique({
    where: { id: pid },

    include: {
        stages: {
            orderBy: {
                stageOrder: "asc"
            }
        },

        approvals: {
            orderBy: {
                stage: "asc"
            }
        },

        projectManager: true,
    },
  });
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