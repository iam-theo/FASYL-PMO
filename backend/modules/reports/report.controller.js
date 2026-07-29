import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create Report
 * POST /api/v1/reports
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
        content,
        fileUrl,
        fileName,
        periodStart,
        periodEnd
        } = req.body;

        if (!projectId || !title) {
        return res.status(400).json({
            message: "projectId and title are required"
        });
        }

        // Verify project exists
        const project = await prisma.project.findUnique({
        where: {
            id: Number(projectId)
        }
        });

        if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
        }

        // Verify stage exists if supplied
        if (stageId) {
        const stage = await prisma.projectStage.findUnique({
            where: {
            id: Number(stageId)
            }
        });

        if (!stage) {
            return res.status(404).json({
            message: "Project stage not found"
            });
        }
        }

        const report = await prisma.report.create({
        data: {
            projectId: Number(projectId),
            stageId: stageId ? Number(stageId) : null,
            createdById: createdById ? Number(createdById) : null,

            title,
            description,

            type: type || "PROJECT",

            content: content || null,

            fileUrl: fileUrl || null,
            fileName: fileName || null,

            periodStart: periodStart
            ? new Date(periodStart)
            : null,

            periodEnd: periodEnd
            ? new Date(periodEnd)
            : null
        },
        include: {
            project: true,
            stage: true,
            createdBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
            }
        }
        });

        return res.status(201).json({
        message: "Report created successfully",
        report
        });
    } catch (error) {
        console.error("Create report error:", error);

        return res.status(500).json({
        message: "Failed to create report"
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
                role: true
            }
            },

            approvedBy: {
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

        return res.json(reports);
    } catch (error) {
        console.error("Get reports error:", error);

        return res.status(500).json({
        message: "Failed to fetch reports"
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
            id: Number(id)
        },

        include: {
            project: true,

            stage: true,

            createdBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
            },

            approvedBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
            }
        }
        });

        if (!report) {
        return res.status(404).json({
            message: "Report not found"
        });
        }

        return res.json(report);
    } catch (error) {
        console.error("Get report error:", error);

        return res.status(500).json({
        message: "Failed to fetch report"
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

        const reports = await prisma.report.findMany({
        where: {
            projectId: Number(projectId)
        },

        include: {
            stage: true,

            createdBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
            },

            approvedBy: {
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

        return res.json(reports);
    } catch (error) {
        console.error("Get project reports error:", error);

        return res.status(500).json({
        message: "Failed to fetch project reports"
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

        const reports = await prisma.report.findMany({
        where: {
            stageId: Number(stageId)
        },

        include: {
            project: true,

            createdBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
            },

            approvedBy: {
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

        return res.json(reports);
    } catch (error) {
        console.error("Get stage reports error:", error);

        return res.status(500).json({
        message: "Failed to fetch stage reports"
        });
    }
    };


    /**
     * Update Report
     * PATCH /api/v1/reports/:id
     */
    export const updateReport = async (req, res) => {
    try {
        const { id } = req.params;

        const {
        title,
        description,
        type,
        content,
        fileUrl,
        fileName,
        periodStart,
        periodEnd,
        stageId
        } = req.body;

        const existingReport = await prisma.report.findUnique({
        where: {
            id: Number(id)
        }
        });

        if (!existingReport) {
        return res.status(404).json({
            message: "Report not found"
        });
        }

        // Prevent editing approved or archived reports
        if (
        existingReport.status === "APPROVED" ||
        existingReport.status === "ARCHIVED"
        ) {
        return res.status(400).json({
            message: `Cannot edit a report with status ${existingReport.status}`
        });
        }

        const report = await prisma.report.update({
        where: {
            id: Number(id)
        },

        data: {
            title,
            description,
            type,
            content,

            fileUrl:
            fileUrl !== undefined
                ? fileUrl || null
                : undefined,

            fileName:
            fileName !== undefined
                ? fileName || null
                : undefined,

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
                : undefined
        },

        include: {
            project: true,
            stage: true,

            createdBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
            }
        }
        });

        return res.json({
        message: "Report updated successfully",
        report
        });
    } catch (error) {
        console.error("Update report error:", error);

        return res.status(500).json({
        message: "Failed to update report"
        });
    }
};


/**
 * Submit Report
 * POST /api/v1/reports/:id/submit
 */
export const submitReport = async (req, res) => {
    try {
        const { id } = req.params;

        const existingReport = await prisma.report.findUnique({
        where: {
            id: Number(id)
        }
        });

        if (!existingReport) {
        return res.status(404).json({
            message: "Report not found"
        });
        }

        if (
        existingReport.status !== "DRAFT" &&
        existingReport.status !== "REJECTED"
        ) {
        return res.status(400).json({
            message: `Report cannot be submitted from ${existingReport.status} status`
        });
        }

        const report = await prisma.report.update({
        where: {
            id: Number(id)
        },

        data: {
            status: "SUBMITTED",
            submittedAt: new Date()
        }
        });

        return res.json({
        message: "Report submitted successfully",
        report
        });
    } catch (error) {
        console.error("Submit report error:", error);

        return res.status(500).json({
        message: "Failed to submit report"
        });
    }
};


/**
 * Approve Report
 * POST /api/v1/reports/:id/approve
 */
export const approveReport = async (req, res) => {
    try {
        const { id } = req.params;

        const {
        approvedById
        } = req.body;

        if (!approvedById) {
        return res.status(400).json({
            message: "approvedById is required"
        });
        }

        const existingReport = await prisma.report.findUnique({
        where: {
            id: Number(id)
        }
        });

        if (!existingReport) {
        return res.status(404).json({
            message: "Report not found"
        });
        }

        if (
        existingReport.status !== "SUBMITTED" &&
        existingReport.status !== "UNDER_REVIEW"
        ) {
        return res.status(400).json({
            message: `Report cannot be approved from ${existingReport.status} status`
        });
        }

        const report = await prisma.report.update({
        where: {
            id: Number(id)
        },

        data: {
            status: "APPROVED",
            approvedById: Number(approvedById),
            approvedAt: new Date()
        },

        include: {
            project: true,

            approvedBy: {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true
            }
            }
        }
        });

        return res.json({
        message: "Report approved successfully",
        report
        });
    } catch (error) {
        console.error("Approve report error:", error);

        return res.status(500).json({
        message: "Failed to approve report"
        });
    }
};


/**
 * Reject Report
 * POST /api/v1/reports/:id/reject
 */
export const rejectReport = async (req, res) => {
    try {
        const { id } = req.params;

        const {
        reason
        } = req.body;

        const existingReport = await prisma.report.findUnique({
        where: {
            id: Number(id)
        }
        });

        if (!existingReport) {
        return res.status(404).json({
            message: "Report not found"
        });
        }

        if (
        existingReport.status !== "SUBMITTED" &&
        existingReport.status !== "UNDER_REVIEW"
        ) {
        return res.status(400).json({
            message: `Report cannot be rejected from ${existingReport.status} status`
        });
        }

        const report = await prisma.report.update({
        where: {
            id: Number(id)
        },

        data: {
            status: "REJECTED",

            // Keep rejection reason inside JSON content
            content: {
            ...(existingReport.content || {}),
            rejectionReason: reason || "Report rejected"
            }
        }
        });

        return res.json({
        message: "Report rejected successfully",
        report
        });
    } catch (error) {
        console.error("Reject report error:", error);

        return res.status(500).json({
        message: "Failed to reject report"
        });
    }
};


/**
 * Delete Report
 * DELETE /api/v1/reports/:id
 */
export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const existingReport = await prisma.report.findUnique({
        where: {
            id: Number(id)
        }
        });

        if (!existingReport) {
        return res.status(404).json({
            message: "Report not found"
        });
        }

        if (existingReport.status === "APPROVED") {
        return res.status(400).json({
            message: "Approved reports cannot be deleted"
        });
        }

        await prisma.report.delete({
        where: {
            id: Number(id)
        }
        });

        return res.json({
        message: "Report deleted successfully"
        });
    } catch (error) {
        console.error("Delete report error:", error);

        return res.status(500).json({
        message: "Failed to delete report"
        });
    }
};