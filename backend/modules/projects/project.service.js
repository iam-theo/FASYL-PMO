import { PrismaClient, WorkflowStatus } from "@prisma/client";
import { getPolicy } from "../workflow/workflow.policy";
const prisma = new PrismaClient();

const TOTAL_STAGES = 8;

/* =========================================
   PROGRESS CALCULATION
========================================= */
const calcProgress = (stage) => {
  return (stage / TOTAL_STAGES) * 100;
};

/* =========================================
   CREATE PROJECT + WORKFLOW INIT
========================================= */
export const createProjectService = async (data, user) => {
  const startStage = 1;

  return await prisma.project.create({
    data: {
      projectName: data.name,
      clientName: data.clientName,
      industry: data.industry,
      productName: data.productName,
      description: data.description || null,

      // 🔐 PM assignment via EMAIL (source of truth)
      projectManagerEmail: data.projectManagerEmail || null,

      // PMO creator
      pmoId: user.id,

      currentStage: startStage,
      status: `stage_${startStage}`,
      workflowStatus: WorkflowStatus.OPEN,
      progressPercent: calcProgress(startStage),

      /* =========================
         WORKFLOW INITIALIZATION
      ========================= */
      stage1: { create: { workflowStatus: WorkflowStatus.OPEN, stageName: getPolicy.stage1.stageName } },
      stage2: { create: { workflowStatus: WorkflowStatus.LOCKED, stageName: getPolicy.stage2.stageName } },
      stage3: { create: { workflowStatus: WorkflowStatus.LOCKED, stageName: getPolicy.stage3.stageName } },
      stage4: { create: { workflowStatus: WorkflowStatus.LOCKED, stageName: getPolicy.stage4.stageName } },
      stage5: { create: { workflowStatus: WorkflowStatus.LOCKED, stageName: getPolicy.stage5.stageName } },
      stage6: { create: { workflowStatus: WorkflowStatus.LOCKED, stageName: getPolicy.stage6.stageName } },
      stage7: { create: { workflowStatus: WorkflowStatus.LOCKED, stageName: getPolicy.stage7.stageName } },
      stage8: { create: { workflowStatus: WorkflowStatus.LOCKED, stageName: getPolicy.stage8.stageName } },
    },

    include: {
      stage1: true,
      stage2: true,
      stage3: true,
      stage4: true,
      stage5: true,
      stage6: true,
      stage7: true,
      stage8: true,
    },
  });

};

/* =========================================
   GET ALL PROJECTS (ROLE-AWARE)
========================================= */
export const getProjectsService = async (user) => {
  const where = {};

  if (user.role === "PROJECTMANAGER") {
    where.projectManagerEmail = user.email;
  }

  return await prisma.project.findMany({
    where,
    include: {
      stage1: true,
      stage2: true,
      stage3: true,
      stage4: true,
      stage5: true,
      stage6: true,
      stage7: true,
      stage8: true,
    },
  });
};
/* =========================================
   GET PROJECT BY ID
========================================= */
export const getProjectByIdService = async (id) => {
  return await prisma.project.findUnique({
    where: { id: Number(id) },

    include: {
      stage1: true,
      stage2: true,
      stage3: true,
      stage4: true,
      stage5: true,
      stage6: true,
      stage7: true,
      stage8: true,
    },
  });
};

/* =========================================
   UPDATE PROJECT
========================================= */
export const updateProjectService = async (id, data) => {
  return await prisma.project.update({
    where: { id: Number(id) },

    data: {
      ...(data.name && { projectName: data.name }),
      ...(data.clientName && { clientName: data.clientName }),
      ...(data.industry && { industry: data.industry }),
      ...(data.productName && { productName: data.productName }),
      ...(data.description && { description: data.description }),

      // 🔐 allow reassignment by email
      ...(data.projectManagerEmail !== undefined && {
        projectManagerEmail: data.projectManagerEmail,
      }),
    },
  });
};

/* =========================================
   DELETE PROJECT
========================================= */
export const deleteProjectService = async (id) => {
  return await prisma.project.delete({
    where: { id: Number(id) },
  });
};