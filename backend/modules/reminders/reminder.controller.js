import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create Reminder
 * POST /api/v1/reminders
 */
export const createReminder = async (req, res) => {
  try {
    const {
      userId,
      projectId,
      taskId,
      stageId,
      title,
      message,
      type,
      remindAt
    } = req.body;

    if (!userId || !title || !remindAt) {
      return res.status(400).json({
        success: false,
        message: "userId, title and remindAt are required"
      });
    }

    // Validate user
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Validate project if supplied
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: {
          id: Number(projectId)
        }
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }
    }

    // Validate task if supplied
    if (taskId) {
      const task = await prisma.task.findUnique({
        where: {
          id: Number(taskId)
        }
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }
    }

    // Validate stage if supplied
    if (stageId) {
      const stage = await prisma.projectStage.findUnique({
        where: {
          id: Number(stageId)
        }
      });

      if (!stage) {
        return res.status(404).json({
          success: false,
          message: "Project stage not found"
        });
      }
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: Number(userId),

        projectId: projectId
          ? Number(projectId)
          : null,

        taskId: taskId
          ? Number(taskId)
          : null,

        stageId: stageId
          ? Number(stageId)
          : null,

        title,
        message: message || null,

        type: type || "GENERAL",

        remindAt: new Date(remindAt)
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },

        project: true,
        task: true,
        stage: true
      }
    });

    return res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder
    });
  } catch (error) {
    console.error("Create reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create reminder"
    });
  }
};


/**
 * Get All Reminders
 * GET /api/v1/reminders
 */
export const getReminders = async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },

        project: true,
        task: true,
        stage: true
      },

      orderBy: {
        remindAt: "asc"
      }
    });

    return res.json({
      success: true,
      count: reminders.length,
      reminders
    });
  } catch (error) {
    console.error("Get reminders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reminders"
    });
  }
};


/**
 * Get User Reminders
 * GET /api/v1/reminders/user/:userId
 */
export const getUserReminders = async (req, res) => {
  try {
    const { userId } = req.params;

    const reminders = await prisma.reminder.findMany({
      where: {
        userId: Number(userId)
      },

      include: {
        project: true,
        task: true,
        stage: true
      },

      orderBy: {
        remindAt: "asc"
      }
    });

    return res.json({
      success: true,
      count: reminders.length,
      reminders
    });
  } catch (error) {
    console.error("Get user reminders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user reminders"
    });
  }
};


/**
 * Get Single Reminder
 * GET /api/v1/reminders/:id
 */
export const getReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.findUnique({
      where: {
        id: Number(id)
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },

        project: true,
        task: true,
        stage: true
      }
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    return res.json({
      success: true,
      reminder
    });
  } catch (error) {
    console.error("Get reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reminder"
    });
  }
};


/**
 * Update Reminder
 * PATCH /api/v1/reminders/:id
 */
export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      message,
      type,
      remindAt,
      status
    } = req.body;

    const existingReminder = await prisma.reminder.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingReminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    const reminder = await prisma.reminder.update({
      where: {
        id: Number(id)
      },

      data: {
        title,
        message,
        type,
        status,

        remindAt:
          remindAt !== undefined
            ? new Date(remindAt)
            : undefined
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },

        project: true,
        task: true,
        stage: true
      }
    });

    return res.json({
      success: true,
      message: "Reminder updated successfully",
      reminder
    });
  } catch (error) {
    console.error("Update reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update reminder"
    });
  }
};


/**
 * Complete Reminder
 * POST /api/v1/reminders/:id/complete
 */
export const completeReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.update({
      where: {
        id: Number(id)
      },

      data: {
        status: "COMPLETED",
        completedAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: "Reminder completed successfully",
      reminder
    });
  } catch (error) {
    console.error("Complete reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete reminder"
    });
  }
};


/**
 * Dismiss Reminder
 * POST /api/v1/reminders/:id/dismiss
 */
export const dismissReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.update({
      where: {
        id: Number(id)
      },

      data: {
        status: "DISMISSED",
        dismissedAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: "Reminder dismissed successfully",
      reminder
    });
  } catch (error) {
    console.error("Dismiss reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to dismiss reminder"
    });
  }
};


/**
 * Cancel Reminder
 * POST /api/v1/reminders/:id/cancel
 */
export const cancelReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await prisma.reminder.update({
      where: {
        id: Number(id)
      },

      data: {
        status: "CANCELLED"
      }
    });

    return res.json({
      success: true,
      message: "Reminder cancelled successfully",
      reminder
    });
  } catch (error) {
    console.error("Cancel reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel reminder"
    });
  }
};


/**
 * Delete Reminder
 * DELETE /api/v1/reminders/:id
 */
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const existingReminder = await prisma.reminder.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingReminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found"
      });
    }

    await prisma.reminder.delete({
      where: {
        id: Number(id)
      }
    });

    return res.json({
      success: true,
      message: "Reminder deleted successfully"
    });
  } catch (error) {
    console.error("Delete reminder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete reminder"
    });
  }
};