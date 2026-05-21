import { PrismaClient, WorkflowStatus } from "@prisma/client";
import { getPolicy } from "../../modules/workflow/workflow.policy.js";
const prisma = new PrismaClient();

const TOTAL_STAGES = 8;
/* =========================================
    PROGRESS CALCULATION
========================================= */
const calcProgress = (stage) => {
  return (stage / TOTAL_STAGES) * 100;
};

const createChecklist = (items) => {
  return items.map((item, index) => ({
    id: item.id || `c${index + 1}`,
    key: item.key,
    title: item.title,
    desc: item.desc,
    isRequired: item.isRequired ?? false,
    completed: false,
    completedAt: null,
  }));
};

const createRequiredDocs = (docs) => {
  return docs.map((doc, index) => ({
    id: `d${index + 1}`,
    key: doc,
    title: doc.title,
    fileURL: null,
    uploadedAt: null,
  }));
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
      stages: {
        create: Array.from({ length: TOTAL_STAGES }, (_, index) => {
          const stageNumber = index + 1;
          const stagePolicy = getPolicy(stageNumber);

          return {
            stageIndex: stageNumber,
            stageName: stagePolicy.name,

            workflowStatus:
              stageNumber === 1
                ? WorkflowStatus.OPEN
                : WorkflowStatus.LOCKED,

            checklist: createChecklist(stagePolicy.checklist),

            requiredDocs: createRequiredDocs(
              stagePolicy.requiredDocs || []
            )
          };
        })
      },
    },

    include: {
      stages: true
    }
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
      stages: true,
    },
    orderBy: [
      { projectManagerEmail: "asc" },
      { updatedAt: "desc" },
    ],
  });
};


/* =========================================
    GET PROJECT BY ID
========================================= */
export const getProjectByIdService = async (id) => {
  return await prisma.project.findUnique({
    where: { id: Number(id) },

    include: {
      stages:true
    },
  });
};


/* =========================================
    UPDATE CHECKLIST
========================================= */
export const updateChecklistBulkService = async (
  projectId,
  stageId,
  checklist
) => {

  console.log("⚙️ SERVICE HIT");
  console.log("DATA RECEIVED:", checklist);

  const stage = await prisma.projectStage.findFirst({
    where: {
      id: Number(stageId),
      projectId: Number(projectId),
    },
  });

  if (!stage) throw new Error("Stage not found");

  // IMPORTANT: normalize incoming checklist
  const updatedChecklist = stage.checklist.map(existingItem => {
    const incomingItem = checklist.find(i => i.id === existingItem.id);

    if (!incomingItem) return existingItem

    return {
      ...existingItem,
      completed: incomingItem.completed,
      completedAt: incomingItem.completed ? new Date() : null,
    };
  });

  // console.log("SENDING CHECKLIST:", updatedChecklist)

  const allChecked = updatedChecklist.every(i => i.completed);

  console.log("💾 WRITING TO DB...");

  const updatedStage = await prisma.projectStage.update({
    where: { id: Number(stageId) },
    data: {
      checklist: updatedChecklist,
      completed: allChecked,
    },
  });

  console.log("✅ DB UPDATE RESULT:", updatedStage);

  return updatedStage;
};

/* =========================================
    UPDATE PROJECT
========================================= */
export const updateProjectService = async (id, data) => {
  return await prisma.project.update({
    where: { id: Number(id) },
    data: {
      ...(data.name !== undefined && { projectName: data.name }),
      ...(data.clientName !== undefined && { clientName: data.clientName }),
      ...(data.industry !== undefined && { industry: data.industry }),
      ...(data.productName !== undefined && { productName: data.productName }),
      ...(data.description !== undefined && { description: data.description }),
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