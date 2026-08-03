import { PrismaClient } from "@prisma/client";
import { ROLES } from "../../constants/roles.js";
import { formatTask } from "./tasks.utils.js";
// import { createReminderService } from "../reminders/reminder.service.js";
import { createReminder } from "../reminders/reminder.controller.js";

const prisma = new PrismaClient();

// const getReminderDate = (dueDate, daysBefore = 1) => {
//     const remindAt = new Date(dueDate);
//     remindAt.setDate(remindAt.getDate() - daysBefore);
//     return remindAt;
// };

export const createTaskService = async (body, user) => {

    console.log("body =", body);
    console.log("user =", user);

    const {
        projectId,
        stageOrder,
        assignedToUserId,
        assignedResourceId,
        title,
        description,
        priority,
        startDate,
        dueDate
    } = body;

    const { id: loggedInUserId, role } = user;

    let taskAssignedToUserId = null;
    let taskAssignedResourceId = null;

    if (!projectId || !title) throw new Error("Project ID and title are required");

    const project = await prisma.project.findUnique({
        where: {
            projectId
        }
    })

    if(!project) throw new Error("Project not found");

    const projectResources = Array.isArray(project.resources) ? project.resources : [];

    let stage = null;

    if(stageOrder !== undefined && stageOrder !== null) {
        stage = await prisma.projectStage.findUnique({
            where: {
                projectId_stageOrder: {
                    projectId,
                    stageOrder
                }
            }
        });

        if(!stage) throw new Error("Stage not found");
    }

    if(role === ROLES.HEADOFOPS) {

        if(!assignedToUserId) throw new Error("Project Manager is required");

        const pm = await prisma.user.findUnique({
            where: {
                id: Number(assignedToUserId)
            }
        });

        if(!pm) throw new Error("Project Manager not found")

        if(pm.role !== ROLES.PROJECTMANAGER) throw new Error("Tasks can only be assigned to a Project Manager");

        taskAssignedToUserId = pm.id;

    } else if(role === ROLES.PROJECTMANAGER) {

        if(!assignedResourceId) throw new Error("A Project Resource must be selected");

        const resource = projectResources.find(
            (resource) => resource.recordId === assignedResourceId
        );

        if(!resource) throw new Error("The selected resource is not assigned to this project.");

        taskAssignedResourceId = resource.recordId;

    } else {
        throw new Error("You are not authorized to assign tasks.")
    }

    const task = await prisma.task.create({
        data: {
            projectId: project.id,
            stageId: stage ? stage.id : null,

            title,
            description,
            priority: priority || "MEDIUM",

            startDate: startDate ? new Date(startDate) : null,

            dueDate: dueDate ? new Date(dueDate) : null,

            assignedById: loggedInUserId,
            createdById: loggedInUserId,
            assignedToUserId: taskAssignedToUserId,
            assignedResourceId: taskAssignedResourceId
        },

        include: {
            assignedToUser: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },

            stage: {
                select: {
                    id: true,
                    stageName: true,
                    stageOrder: true
                }
            },

            project: {
                select: {
                    id: true,
                    projectId: true,
                    projectName: true,
                    resources: true
                }
            },

            assignedBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },

            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        }

    });

    // const reminderUserId = task.assignedToUserId ?? loggedInUserId;
    // const remindAt = new Date(task.dueDate);
    // remindAt.setDate(remindAt.getDate() -2);

    await createReminder(
        task,
        project,
        stage,
        task.assignedToUserId ?? loggedInUserId,
        2
    );

    return formatTask(task);
}

export const getTaskServiceAll = async () => {

    const tasks = await prisma.task.findMany({

        include: {
            project: {
                select: {
                    id: true,
                    projectId: true,
                    projectName: true,
                    workflowStatus: true,
                    resources: true
                }
            },

            stage: {
                select: {
                    id: true,
                    stageName: true,
                    stageOrder: true
                }
            },

            assignedToUser: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true
                }
            },

            assignedBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },

            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        },

        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedTasks = tasks.map((task) => {

        let assignee = null;

        if(task.assignedToUser) {
            assignee = {

                type: ROLES.PROJECTMANAGER,
                id: task.assignedToUser.id,
                fullName: task.assignedToUser.fullName,
                email: task.assignedToUser.email,
                role: task.assignedToUser.role
            };
        } else if(task.assignedResourceId) {

            const resources = Array.isArray(task.project.resources)
                ? task.project.resources
                : [];

            const resource = resources.find(
                (resource) => resource.recordId === task.assignedResourceId
            );

            if(resource) {
                assignee = {
                    type: ROLES.RESOURCE,
                    id: resource.recordId,
                    fullName: `${resource.firstName} ${resource.lastName}`,
                    email: resource.email,
                    staffId: resource.staffId,
                    phoneNumber: resource.phoneNumber
                };
            }
        }

        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            dueDate: task.dueDate,
            completedAt: task.completedAt,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,

            project: {
                id: task.project.id,
                projectId: task.project.projectId,
                projectName: task.project.projectName
            },

            stage: task.stage,
            assignee,
            assignedBy: task.assignedBy,
            createdBy: task.createdBy
        };
    });

    return formattedTasks
}

export const getTaskService = async (
    projectId,
    stageOrder
) => {

    const project = await prisma.project.findUnique({

        where: {
            projectId
        },

        select: {
            id: true,
            resources: true
        }

    });

    if (!project) {
        throw new Error("Project not found.");
    }

    const stage = await prisma.projectStage.findUnique({

        where: {

            projectId_stageOrder: {

                projectId,
                stageOrder

            }

        },

        select: {

            id: true

        }

    });

    if (!stage) {
        throw new Error("Project stage not found.");
    }

    const tasks = await prisma.task.findMany({

        where: {
            projectId: project.id,
            stageId: stage.id
        },

        include: {
            project: {
                select: {
                    id: true,
                    projectId: true,
                    projectName: true,
                    workflowStatus: true,
                    resources: true
                }
            },

            stage: {
                select: {
                    id: true,
                    stageName: true,
                    stageOrder: true
                }
            },

            assignedToUser: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true
                }
            },

            assignedBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },

            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        },

        orderBy: {
            createdAt: "desc"
        }
    });

    return tasks.map(formatTask)
}

export const updateTaskService = async (
    taskId,
    body
) => {

    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    });

    if(!task) throw new Error("Task not found")

    const data = {
        ...(body.title !== undefined && {
            title: body.title
        }),

        ...(body.description !== undefined && {
            description: body.description
        }),

        ...(body.priority !== undefined && {
            priority: body.priority
        }),

        ...(body.status !== undefined && {
            status: body.status,
            completedAt:
                body.status === "COMPLETED"
                    ? new Date()
                    : null
        }),

        ...(body.startDate !== undefined && {
            startDate: body.startDate
                ? new Date(body.startDate)
                : null
        }),

        ...(body.dueDate !== undefined && {
            dueDate: body.dueDate
                ? new Date(body.dueDate)
                : null
        }),

        ...(body.assignedToUserId !== undefined && {
            assignedToUserId: body.assignedToUserId
                ? Number(body.assignedToUserId)
                : null
        }),

        ...(body.assignedResourceId !== undefined && {
            assignedResourceId: body.assignedResourceId || null
        })
    };

    const updatedTask = await prisma.task.update({

        where: {
            id: taskId
        },
        data,

        include: {
            project: {
                select: {
                    id: true,
                    projectId: true,
                    projectName: true,
                    workflowStatus: true,
                    resources: true
                }
            },

            stage: {
                select: {
                    id: true,
                    stageName: true,
                    stageOrder: true
                }
            },

            assignedToUser: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true
                }
            },

            assignedBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },

            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        }
    });

    return formatTask(updatedTask);
}

export const deleteTaskService = async (taskId) => {

    const task = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    });

    if (!task) {
        throw new Error("Task not found");
    }

    await prisma.task.delete({
        where: {
            id: taskId
        }
    });

    return task;
};