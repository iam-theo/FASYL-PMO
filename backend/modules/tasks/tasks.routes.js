import express from "express";

import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} from "./tasks.controller.js";
import { authMiddleWare } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/rbac.middleware.js";
import { ROLES } from "../../constants/roles.js";

const router = express.Router();

// router.use((req, res, next) => {
//     console.log("Task Router Hit:", req.method, req.originalUrl);
//     next();
// });

router.post(
    "/", 
    authMiddleWare,
    allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
    createTask
);

router.get(
    "/project/:projectId/stage/:stageOrder", 
    authMiddleWare,
    allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
    getTasks
);

router.get("/:id", getTask);

router.patch(
    "/:id", 
    authMiddleWare,
    allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
    updateTask
);

router.delete(
    "/:id", 
    authMiddleWare,
    allowRoles(ROLES.HEADOFOPS, ROLES.PROJECTMANAGER),
    deleteTask
);

export default router;