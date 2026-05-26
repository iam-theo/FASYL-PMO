import { PrismaClient, WorkflowStatus } from "@prisma/client";
import { getPolicy } from "../../modules/workflow/workflow.policy.js";
const prisma = new PrismaClient();
import axios from "axios";

const TOTAL_STAGES = 8;
/* =========================================
    PROGRESS CALCULATION
========================================= */
const calcProgress = (stage) => {
  return (stage / TOTAL_STAGES) * 100;
};

const createChecklist = (items, stageKey) => {
  return items.map((item, index) => ({
    id: item.id || `${stageKey}-c${index + 1}`,
    key: item.key,
    title: item.title,
    desc: item.desc,
    isRequired: item.isRequired ?? false,
    completed: false,
    completedAt: null,
  }));
};

const createRequiredDocs = (docs, stageKey) => {
  return docs.map((doc, index) => ({
    id:`${stageKey}-c${index + 1}`,
    key: typeof  doc === "string" ? doc : doc.key,
    title: typeof doc === "string"
        ? doc
        : doc.title || doc.key,
    fileURL: null,
    fileName: null,
    uploadedAt: null,
    status: "PENDING"
  }));
};

export const getStageKey = (order) => {
  const map = {
    1: "client_identification",
    2: "client_engagement",
    3: "project_initiation",
    4: "project_planning",
    5: "project_execution",
    6: "project_uat",
    7: "go_live",
    8: "project_closure"
  };

  return map[order];
};

export const buildWorkflowForProject = async (projectId) => {
  // PREVENT DUPLICATION
  const existingCount = await prisma.projectStage.count({
    where: { projectId },
  });

  if (existingCount > 0) {
    return {
      message: "Workflow already exists",
      skipped: true,
    };
  }

  // =========================
  // BUILD STAGES
  // =========================
  const stagesData = Array.from({ length: TOTAL_STAGES }, (_, index) => {
    const stageOrder = index + 1;
    const stageKey = getStageKey(stageOrder);
    const policy = getPolicy(stageKey);

    return {
      projectId,

      stageIndex: stageOrder,
      stageOrder,

      stageKey: policy.key,
      stageName: policy.name,

      workflowStatus: stageOrder === 1 ? "OPEN" : "LOCKED",

      checklist: JSON.parse(JSON.stringify(
        createChecklist(policy.checklist, stageKey)
      )),

      requiredDocs: JSON.parse(JSON.stringify(
        createRequiredDocs(policy.requiredDocs || [], stageKey)
      )),
    };
  });

  await prisma.projectStage.createMany({
    data: stagesData,
  });

  // =========================
  // CREATE APPROVALS
  // =========================
  const approvals = stagesData.map((stage) => ({
    projectId,
    stage: stage.stageOrder,
    status: "PENDING",
  }));

  await prisma.projectApproval.createMany({
    data: approvals,
  });

  return {
    success: true,
    message: "Workflow created",
  };
};

// export const createProjectService = async (data, user) => {
//   const dbUser = await prisma.user.findUnique({
//     where: { id: user.id },
//   });

//   if (!dbUser) {
//     throw new Error("Invalid PMO user");
//   }

//   let projectManagerId = null;

//   if (data.projectManagerEmail) {
//     const pm = await prisma.user.findUnique({
//       where: { email: data.projectManagerEmail },
//     });

//     if (!pm) {
//       throw new Error("Project Manager not found");
//     }

//     projectManagerId = pm.id;
//   }

//   // =========================
//   // CREATE PROJECT
//   // =========================
//   const project = await prisma.project.create({
//     data: {
//       projectName: data.name,
//       clientName: data.clientName,
//       productName: data.productName,

//       projectManagerId,

//       workflowStatus: "OPEN",
//       currentStageOrder: 1,
//     },
//   });

//   // =========================
//   // 🔥 BUILD WORKFLOW (ONE SYSTEM FOR ALL)
//   // =========================
//   await buildWorkflowForProject(project.id);

//   return prisma.project.findUnique({
//     where: { id: project.id },
//     include: {
//       stages: true,
//       approvals: true,
//       projectManager: true,
//     },
//   });
// };

export const assignProjectService = async (projectId, pmEmail) => {

  const user = await prisma.user.findUnique({
    where: { email: pmEmail }
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "PROJECTMANAGER") {
    throw new Error("User is not a Project Manager");
  }

  const project = await prisma.project.update({
    where: { id: Number(projectId) },
    data: {
      projectManagerId: user.id,  

      currentStageOrder: 1,
      workflowStatus: "OPEN",
    },
  });

  await prisma.projectStage.updateMany({
    where: {
      projectId: project.id,
      stageOrder: 1,
    },
    data: {
      workflowStatus: "OPEN",
    },
  });

  await prisma.projectStage.updateMany({
    where: {
      projectId: project.id,
      stageOrder: { gt: 1 },
    },
    data: {
      workflowStatus: "LOCKED",
    },
  });

  return await prisma.project.findUnique({
    where: {
      id: project.id,
    },

    include: {
      projectManager: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },

      stages: {
        orderBy: {
          stageOrder: "asc",
        },
      },

      approvals: true,
    },
  });
};

/* =========================================
    GET PROJECT
========================================= */
export const getProjectsService = async (user) => {
  const where = {};

  // ROLE-BASED FILTERING
  if (user.role === "PROJECTMANAGER") {
    where.projectManager = user.email;
  }

  const projects = await prisma.project.findMany({
    include: {
      projectManager: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      stages: true,
      approvals: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return projects;
};

export const getProjectByIdService = async (id) => {
  return await prisma.project.findUnique({
    where: { id: Number(id) },
    include: {
      stages: {
        orderBy: { stageOrder: "asc" }
      },
      approvals: {
        orderBy: { stage: "asc" }
      }
    }
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

  console.log("SERVICE HIT");
  console.log("DATA RECEIVED:", checklist);

  const stage = await prisma.projectStage.findFirst({
    where: {
      id: Number(stageId),
      projectId: Number(projectId),
    },
  });

  if (!stage) throw new Error("Stage not found");

  const updatedChecklist = stage.checklist.map(existingItem => {
    const incomingItem = checklist.find(i => i.id === existingItem.id);

    if (!incomingItem) return existingItem

    return {
      ...existingItem,
      completed: incomingItem.completed,
      completedAt: incomingItem.completed ? new Date() : null,
    };
  });

  console.log("SENDING CHECKLIST:", updatedChecklist)

  const allChecked = updatedChecklist.every(i => i.completed);

  console.log("WRITING TO DB...");

  const updatedStage = await prisma.projectStage.update({
    where: { id: Number(stageId) },
    data: {
      checklist: updatedChecklist,
      completed: allChecked,
      completedAt: new Date(),
    },
  });

  console.log("DB UPDATE RESULT:", updatedStage);

  return updatedStage;
};


// UPLOAD DOCS

export const uploadStageDocumentService = async (
  projectId,
  stageId,
  docKey,
  fileUrl,
  fileName
) => {
  const stage = await prisma.projectStage.findFirst({
    where: {
      id: Number(stageId),
      projectId: Number(projectId),
    },
  });

  if (!stage) throw new Error("Stage not found");

  const docs = Array.isArray(stage.requiredDocs)
    ? stage.requiredDocs
    : [];

  const updatedDocs = docs.map(doc => {
    if (doc.key !== docKey) return doc;

    return {
      ...doc,
      fileURL: fileUrl,
      fileName: fileName,
      uploadedAt: new Date(),
      status: "UPLOADED",
    };
  });

  return prisma.projectStage.update({
    where: { id: Number(stageId) },
    data: {
      requiredDocs: updatedDocs,
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