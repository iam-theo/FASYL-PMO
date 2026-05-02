import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "./project.service.js";

/* CREATE */
export const createProject = async (req, res) => {
  try {
    const project = await createProjectService(req.body, req.user);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET ALL */
export const getProjects = async (req, res) => {
  try {
    const projects = await getProjectsService(req.user);

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET ONE */
export const getProject = async (req, res) => {
  try {
    const project = await getProjectByIdService(req.params.id);

    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */
export const updateProject = async (req, res) => {
  try {
    const project = await updateProjectService(req.params.id, req.body);

    res.json({ message: "Updated", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE */
export const deleteProject = async (req, res) => {
  try {
    await deleteProjectService(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};