import { Router } from "express";
import { authMiddleWare } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/rbac.middleware.js";
import { ROLES } from "../../constants/roles.js";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "./project.controller.js";

const router = Router();

/* CREATE PROJECT */
router.post(
  "/",
  authMiddleWare,
  allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
  createProject
);

/* GET ALL PROJECTS */
router.get(
  "/",
  authMiddleWare,
  getProjects
);

/* GET SINGLE */
router.get(
  "/:id",
  authMiddleWare,
  getProject
);

/* UPDATE */
router.put(
  "/:id",
  authMiddleWare,
  allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
  updateProject
);

/* DELETE */
router.delete(
  "/:id",
  authMiddleWare,
  allowRoles(ROLES.HEADOFOPS),
  deleteProject
);

export default router;