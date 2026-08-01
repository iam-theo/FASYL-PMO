import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create Report
 * POST /api/v1/reports
 *
 * Creates a generated project analytics report record.
 * Reports do not have submission, approval, rejection,
 * or review workflows.
 */
export const createReport = async (req, res) => {
  try {
    const {
      projectId,
      stageId,
      createdById,
      title,
      description,
      type,
      format,
      content,
      fileUrl,
      fileName,
      fileType,
      periodStart,
      periodEnd,
    } = req.body;

    if (!projectId || !title || !format) {
      return res.status(400).json({
        message: "projectId, title and format are required",
      });
    }

    // Verify project exists using projectId
    // because Report.projectId references Project.projectId
    const project = await prisma.project.findUnique({
      where: {
        projectId: String(projectId),
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Verify stage exists if supplied
    if (stageId) {
      const stage = await prisma.projectStage.findUnique({
        where: {
          id: Number(stageId),
        },
      });

      if (!stage) {
        return res.status(404).json({
          message: "Project stage not found",
        });
      }

      // Ensure the stage belongs to the selected project
      if (stage.projectId !== project.projectId) {
        return res.status(400).json({
          message: "The selected stage does not belong to this project",
        });
      }
    }

    // Verify creator exists if supplied
    if (createdById) {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(createdById),
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "Report creator not found",
        });
      }
    }

    const report = await prisma.report.create({
      data: {
        projectId: String(projectId),

        stageId: stageId ? Number(stageId) : null,

        createdById: createdById ? Number(createdById) : null,

        title,
        description,

        type: type || "PROJECT",

        format,

        content: content || null,

        fileUrl: fileUrl || null,

        fileName: fileName || null,

        fileType: fileType || null,

        periodStart: periodStart ? new Date(periodStart) : null,

        periodEnd: periodEnd ? new Date(periodEnd) : null,

        generatedAt: new Date(),
      },

      include: {
        project: true,

        stage: true,

        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Report generated successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      message: "Failed to generate report",
    });
  }
};

/**
 * Get All Reports
 * GET /api/v1/reports
 */
export const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        project: true,

        stage: true,

        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
};

/**
 * Get Single Report
 * GET /api/v1/reports/:id
 */
export const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        project: true,

        stage: true,

        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.json(report);
  } catch (error) {
    console.error("Get report error:", error);

    return res.status(500).json({
      message: "Failed to fetch report",
    });
  }
};

/**
 * Get Reports By Project
 * GET /api/v1/reports/project/:projectId
 */
export const getReportsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: {
        projectId: String(projectId),
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const reports = await prisma.report.findMany({
      where: {
        projectId: String(projectId),
      },

      include: {
        stage: true,

        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(reports);
  } catch (error) {
    console.error("Get project reports error:", error);

    return res.status(500).json({
      message: "Failed to fetch project reports",
    });
  }
};

/**
 * Get Reports By Stage
 * GET /api/v1/reports/stage/:stageId
 */
export const getReportsByStage = async (req, res) => {
  try {
    const { stageId } = req.params;

    // Verify stage exists
    const stage = await prisma.projectStage.findUnique({
      where: {
        id: Number(stageId),
      },
    });

    if (!stage) {
      return res.status(404).json({
        message: "Project stage not found",
      });
    }

    const reports = await prisma.report.findMany({
      where: {
        stageId: Number(stageId),
      },

      include: {
        project: true,

        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(reports);
  } catch (error) {
    console.error("Get stage reports error:", error);

    return res.status(500).json({
      message: "Failed to fetch stage reports",
    });
  }
};

/**
 * Update Report
 * PATCH /api/v1/reports/:id
 *
 * Updates report metadata or content.
 * There is no approval or submission restriction.
 */
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      type,
      format,
      content,
      fileUrl,
      fileName,
      fileType,
      periodStart,
      periodEnd,
      stageId,
    } = req.body;

    // Verify report exists
    const existingReport = await prisma.report.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingReport) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // If stageId is being updated,
    // verify that the stage exists
    // and belongs to the same project.
    if (stageId !== undefined && stageId !== null) {
      const stage = await prisma.projectStage.findUnique({
        where: {
          id: Number(stageId),
        },
      });

      if (!stage) {
        return res.status(404).json({
          message: "Project stage not found",
        });
      }

      if (stage.projectId !== existingReport.projectId) {
        return res.status(400).json({
          message: "The selected stage does not belong to this project",
        });
      }
    }

    const report = await prisma.report.update({
      where: {
        id: Number(id),
      },

      data: {
        title: title !== undefined ? title : undefined,

        description: description !== undefined ? description : undefined,

        type: type !== undefined ? type : undefined,

        format: format !== undefined ? format : undefined,

        content: content !== undefined ? content : undefined,

        fileUrl: fileUrl !== undefined ? fileUrl || null : undefined,

        fileName: fileName !== undefined ? fileName || null : undefined,

        fileType: fileType !== undefined ? fileType || null : undefined,

        stageId:
          stageId !== undefined
            ? stageId
              ? Number(stageId)
              : null
            : undefined,

        periodStart:
          periodStart !== undefined
            ? periodStart
              ? new Date(periodStart)
              : null
            : undefined,

        periodEnd:
          periodEnd !== undefined
            ? periodEnd
              ? new Date(periodEnd)
              : null
            : undefined,
      },

      include: {
        project: true,

        stage: true,

        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update report error:", error);

    return res.status(500).json({
      message: "Failed to update report",
    });
  }
};

/**
 * Delete Report
 * DELETE /api/v1/reports/:id
 *
 * Deletes a generated report record.
 * There are no approval restrictions.
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify report exists
    const existingReport = await prisma.report.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingReport) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    await prisma.report.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);

    return res.status(500).json({
      message: "Failed to delete report",
    });
  }
};
