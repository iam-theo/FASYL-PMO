import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  updateChecklistBulkService,
  uploadStageDocumentService
} from "./project.service.js";

console.log("🔥 CHECKLIST ROUTE HIT");
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
    UPDATE CHECKLIST
========================================= */

export const updateChecklistBulk = async (req, res) => {

  console.log("🔥 CHECKLIST ROUTE HIT");
  console.log("PARAMS:", req.params);
  console.log("BODY:", req.body);
  
  try {
    console.log("🔥 CHECKLIST ROUTE HIT");
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    const { projectId, stageId } = req.params;
    const { checklist } = req.body;

    const result = await updateChecklistBulkService(
      projectId,
      stageId,
      checklist
    );

    return res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================
    UPLOAD DOCS
========================================= */

export const uploadStageDocument = async (req, res) => {
  try {
    const { projectId, stageId, docKey } = req.params;

    console.log("RESPONSE:", req.params)

    const file = req.file

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileUrl = `http://localhost:5000/uploads/${file.filename}`;

    const filename = `${file.filename}`

    const updatedStage = await uploadStageDocumentService(
      projectId,
      stageId,
      docKey,
      fileUrl,
      filename
    );

    return res.json({
      success: true,
      message: "Document uploaded successfully",
      data: updatedStage,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: err.message,
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