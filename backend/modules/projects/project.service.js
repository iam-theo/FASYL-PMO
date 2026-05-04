import { PrismaClient, WorkflowStatus } from "@prisma/client";

const prisma = new PrismaClient();

const TOTAL_STAGES = 8;

const calcProgress = (stage) => (stage / TOTAL_STAGES) * 100;

/* =========================================
   CREATE PROJECT + INITIALIZE WORKFLOW
========================================= */
export const createProjectService = async (data, user) => {
  const startStage = 2;

  // =========================
  // DTO MAPPING LAYER (IMPORTANT)
  // Swagger → Service → Prisma alignment
  // =========================
  const projectData = {
    projectName: data.name, // 🔥 Swagger field
    clientName: data.clientName,
    industry: data.industry,
    productName: data.productName,
    projectManager: data.projectManager,

    pmoId: user?.id, // from JWT

    currentStage: startStage,
    status: `stage_${startStage}`,
    workflowStatus: WorkflowStatus.OPEN,
    progressPercent: calcProgress(startStage),

    // =========================
    // INITIAL WORKFLOW STAGES
    // =========================
    stage2: { create: { workflowStatus: WorkflowStatus.OPEN } },
    stage3: { create: { workflowStatus: WorkflowStatus.LOCKED } },
    stage4: { create: { workflowStatus: WorkflowStatus.LOCKED } },
    stage5: { create: { workflowStatus: WorkflowStatus.LOCKED } },
    stage6: { create: { workflowStatus: WorkflowStatus.LOCKED } },
    stage7: { create: { workflowStatus: WorkflowStatus.LOCKED } },
    stage8: { create: { workflowStatus: WorkflowStatus.LOCKED } },
  };

  return await prisma.project.create({
    data: projectData,

    include: {
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
   GET ALL PROJECTS
========================================= */
export const getProjectsService = async (user) => {
  return await prisma.project.findMany({
    include: {
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
      // optional safe mapping
      ...(data.name && { projectName: data.name }),
      ...(data.clientName && { clientName: data.clientName }),
      ...(data.industry && { industry: data.industry }),
      ...(data.productName && { productName: data.productName }),
      ...(data.projectManager && { projectManager: data.projectManager }),
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