import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
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

export const assignProjectManager = async (projectId, email) => {
    return api.put(`/projects/${projectId}`, {
        projectManagerEmail: email
    });
};

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
    file,
    fileName
    ) => {

    const formData = new FormData();

    formData.append("file", file);      // MUST match backend: upload.single("file")

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
            error.response?.data || {
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

        const { data } = await API.post(
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