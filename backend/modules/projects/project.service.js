import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* =========================
   CREATE PROJECT + INIT STAGES
========================= */
export const createProjectService = async (data, user) => {
  return await prisma.project.create({
    data: {
      projectName: data.projectName,
      clientName: data.clientName,
      industry: data.industry,
      productName: data.productName,
      projectManager: data.projectManager,
      pmoId: user.userId,
      status: "stage_1",

      // 🧠 AUTO INIT STAGES
      stage2: { create: {} },
      stage3: { create: {} },
      stage4: { create: {} },
      stage5: { create: {} },
      stage6: { create: {} },
      stage7: { create: {} },
      stage8: { create: {} },
    },

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

/* =========================
   GET ALL PROJECTS
========================= */
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

/* =========================
   GET SINGLE PROJECT
========================= */
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

/* =========================
   UPDATE PROJECT
========================= */
export const updateProjectService = async (id, data) => {
  return await prisma.project.update({
    where: { id: Number(id) },
    data,
  });
};

/* =========================
   DELETE PROJECT
========================= */
export const deleteProjectService = async (id) => {
  return await prisma.project.delete({
    where: { id: Number(id) },
  });
};