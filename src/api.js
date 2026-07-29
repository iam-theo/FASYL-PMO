import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const assignProject = async (projectId, projectManagerEmail) => {

    try {

        const { data } = await api.patch(
            `/projects/${projectId}/assign`,
            {
                projectManagerEmail,
            }
        );

        return data;

    } catch (error) {

        console.error(
            "Assign Project Error:",
            error.response?.data
        );

        throw error.response?.data || error;
    }
};

// export const getAssignableResources = async () => {
//     try {
//         const { data } = await api.get("/resources");
//         return data;
//     } catch (error) {
//         console.error("Get Assignable Resources Error:", error.response?.data);
//         throw error.response?.data || error;
//     }
// };

// export const setupProjectResources = async (projectId, resourceIds) => {
//     try {
//         const { data } = await api.patch(`/projects/${projectId}/setup`, {
//             resourceIds,
//         });
//         return data;
//     } catch (error) {
//         console.error("Setup Project Resources Error:", error.response?.data);
//         throw error.response?.data || error;
//     }
// };

export const handleChecklist = async (projectId, stageId, updatedChecklist) => {
    return api.patch(`/projects/${projectId}/stages/${stageId}/checklist`,
        {
        checklist: updatedChecklist,
    })
}

export const uploadStageDocument = async (
    projectId,
    stageId,
    docKey,
    file
    ) => {

    const formData = new FormData();

    formData.append("file", file); // MUST match backend: upload.single("file")

    return api.patch(
        `/projects/${projectId}/stages/${stageId}/docs/${docKey}`,
        formData,
        {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        }
    );
};

export const deleteStageDocument = (
    projectId,
    stageId,
    docKey
) => {

    return api.delete(
        `/projects/${projectId}/stages/${stageId}/docs/${docKey}`
    );
};

export const submitStage = async (
    projectId,
    stageOrder
    ) => {
    try {
        const { data } = await api.post(
            `/workflow/submit/${projectId}/${stageOrder}`
        );

        return data;

    } catch (error) {
        console.error("Submit Stage Error:", error.response?.data || error.message);

        throw (
            error.response?.data || {
                message: "Something went wrong",
            }
        );
    }
};

export const approveStage = async (projectId, stageOrder) => {
    try {
        const { data } = await api.post(
            `/workflow/approve/${projectId}/${stageOrder}`
        );

        return data;

    } catch (err) {
        console.error("Approve Stage Error:", err.response?.data || err.message);
        
        throw (
            err.response?.data || {
                message: "Something went wrong",
            }
        );
    }
};

export const rejectStage = async (
    projectId,
    stageOrder,
    reason
    ) => {

    try {

        const { data } = await api.post(
            `/workflow/reject/${projectId}/${stageOrder}`,
        {
            reason,
        }
        );

        return data;

    } catch (error) {

        console.error(
            "Reject Stage Error:",
            error.response?.data
        );

        throw error.response?.data || error;
    }
};

export const createTask = async (
    payload
) => {

    try {
        const { data } = await api.post(
            `/tasks/`, payload);

        return data;

    } catch (error) {
        console.error(
            "Create Task Error:",
            error.response?.data
        );

        throw error.response?.data || error;
    }
}

export const getTasks = async (
    projectId,
    stageOrder
) => {

    try {
        const { data } = await api.get(`/tasks/project/${projectId}/stage/${stageOrder}`);

        return data
    } catch (error) {

        console.error(
            "Task Retrieval Error:",
            error.response?.data
        );

        throw error.response?.data || error;
    }
}

export const updateTask = async(
    taskId,
    payload
) => {

    try {

        const { data } = await api.patch(`/tasks/${taskId}`, payload);

        return data
    } catch(error) {

        console.error(
            "Task Update Error:",
            error.response?.data
        );

        throw error.response?.data || error;
    }
}

export const deleteTask = async (taskId) => {

    try {
        const { data } = await api.delete(`/tasks/${taskId}`);

        return data;

    } catch (error) {
        
        console.error(
            "Delete Task Error:",
            error.response?.data
        );

        throw error.response?.data || error;
    }
};
