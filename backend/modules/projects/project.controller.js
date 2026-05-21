import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "./project.service.js";

/* =========================================
    CREATE PROJECT
========================================= */
export const createProject = async (req, res) => {
  try {
    const project = await createProjectService(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: err.message,
    });
  }
};

/* =========================================
    GET ALL PROJECTS (ROLE-AWARE)
========================================= */
export const getProjects = async (req, res) => {
  try {
    const projects = await getProjectsService(req.user);

    return res.json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: err.message,
    });
  }
};

/* =========================================
    GET SINGLE PROJECT
========================================= */
export const getProject = async (req, res) => {
  try {
    const project = await getProjectByIdService(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: err.message,
    });
  }
};

/* =========================================
    UPDATE PROJECT
========================================= */
export const updateProject = async (req, res) => {
  try {
    console.log("PARAMS:", req.params)
    console.log("BODY:", req.body)
    
    const project = await updateProjectService(
      req.params.id,
      req.body
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }


    return res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: err.message,
    });
  }
};

/* =========================================
    DELETE PROJECT
========================================= */
export const deleteProject = async (req, res) => {
  try {
    const project = await deleteProjectService(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: err.message,
    });
  }
};