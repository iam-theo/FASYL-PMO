import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Task
export const createTask = async (req, res) => {
  try {
    const {
      projectId,
      stageId,
      assignedToId,
      title,
      description,
      priority,
      startDate,
      dueDate
    } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({
        message: "projectId and title are required"
      });
    }

    const task = await prisma.task.create({
      data: {
        projectId: Number(projectId),
        stageId: stageId ? Number(stageId) : null,
        assignedToId: assignedToId ? Number(assignedToId) : null,

        title,
        description,
        priority: priority || "MEDIUM",

        startDate: startDate ? new Date(startDate) : null,

        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Failed to create task"
    });
  }
};


// Get All Tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        stage: true,
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};


// Get Single Task
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        project: true,
        stage: true,
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      message: "Failed to fetch task"
    });
  }
};


// Update Task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      assignedToId,
      priority,
      status,
      startDate,
      dueDate
    } = req.body;

    const task = await prisma.task.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        description,

        assignedToId:
          assignedToId !== undefined
            ? assignedToId
              ? Number(assignedToId)
              : null
            : undefined,

        priority,
        status,

        startDate:
          startDate !== undefined
            ? startDate
              ? new Date(startDate)
              : null
            : undefined,

        dueDate:
          dueDate !== undefined
            ? dueDate
              ? new Date(dueDate)
              : null
            : undefined,

        completedAt:
          status === "COMPLETED"
            ? new Date()
            : status
              ? null
              : undefined
      }
    });

    res.json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Failed to update task"
    });
  }
};


// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Failed to delete task"
    });
  }
};