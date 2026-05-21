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