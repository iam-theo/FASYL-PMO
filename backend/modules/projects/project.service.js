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

/* =========================================
    CREATE PROJECT + WORKFLOW INIT
========================================= */
export const createProjectService = async (data, user) => {
  const startOrder = 1;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    throw new Error("Invalid PMO user - does not exist in database");
  }

  // =========================
  // STEP 1: CREATE PROJECT
  // =========================
  const project = await prisma.project.create({
    data: {
      projectName: data.name,
      clientName: data.clientName,
      industry: data.industry,
      productName: data.productName,
      description: data.description || null,

      projectManagerEmail: data.projectManagerEmail || null,
      pmoId: dbUser.id,

      currentStageOrder: startOrder,
      workflowStatus: WorkflowStatus.OPEN,
      progressPercent: calcProgress(startOrder),
    },
  });

  // =========================
  // STEP 2: BUILD STAGES
  // =========================
  const stagesData = Array.from({ length: TOTAL_STAGES }, (_, index) => {
    const stageOrder = index + 1;
    const stageKey = getStageKey(stageOrder);
    const stagePolicy = getPolicy(stageKey);

    return {
      projectId: project.id,
      stageIndex: stageOrder,
      stageOrder: stageOrder,
      stageKey: stagePolicy.key,
      stageName: stagePolicy.name,

      workflowStatus:
        stageOrder === 1 ? WorkflowStatus.OPEN : WorkflowStatus.LOCKED,

      checklist: JSON.parse(JSON.stringify(
        createChecklist(stagePolicy.checklist, stageKey)
      )),

      requiredDocs: JSON.parse(JSON.stringify(
        createRequiredDocs(stagePolicy.requiredDocs || [], stageKey)
      )),
    };
  });

  // =========================
  // STEP 3: INSERT STAGES
  // =========================
  await prisma.projectStage.createMany({
    data: stagesData,
  });

  // =========================
  // STEP 4: RETURN FULL PROJECT
  // =========================
  return await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      stages: true, // checklist + docs already inside JSON
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

// await prisma.projectStage.updateMany({
//   data: {
//     requiredDocs: []
//   }
// });

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