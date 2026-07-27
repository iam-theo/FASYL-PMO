import express from "express";

import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
} from "./task.controller.js";

const router = express.Router();

router.post("/", createTask);

router.get("/", getTasks);

router.get("/:id", getTask);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;