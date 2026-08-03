import axios from "axios";

/**
 * The base URL was hard coded to localhost, which makes every non-local build
 * (staging, preview, production) point at the developer's machine.
 */
const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * When the payload is FormData the browser must generate the
   * `multipart/form-data` header itself, because only it knows the boundary
   * token. Setting the header by hand produces a boundary-less content type
   * and the backend's multer parser rejects the upload.
   */
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

/** Normalizes rejected requests so callers always see the same error shape. */
const normalizeError = (error, context) => {
  if (axios.isCancel?.(error) || error?.code === "ERR_CANCELED") {
    return Promise.reject(error);
  }

  if (import.meta.env?.DEV) {
    console.error(`${context}:`, error?.response?.data ?? error?.message);
  }

  return Promise.reject(error);
};

export const assignProject = async (projectId, projectManagerEmail) => {
  try {
    const { data } = await api.patch(`/projects/${projectId}/assign`, {
      projectManagerEmail,
    });

    return data;
  } catch (error) {
    return normalizeError(error, "Assign Project Error");
  }
};

export const handleChecklist = async (projectId, stageId, updatedChecklist) => {
  try {
    const { data } = await api.patch(
      `/projects/${projectId}/stages/${stageId}/checklist`,
      { checklist: updatedChecklist },
    );

    return data;
  } catch (error) {
    return normalizeError(error, "Update Checklist Error");
  }
};

export const uploadStageDocument = async (projectId, stageId, docKey, file) => {
  const formData = new FormData();

  // Field name must match the backend's upload.single("file")
  formData.append("file", file);

  try {
    const { data } = await api.patch(
      `/projects/${projectId}/stages/${stageId}/docs/${docKey}`,
      formData,
    );

    return data;
  } catch (error) {
    return normalizeError(error, "Upload Stage Document Error");
  }
};

export const deleteStageDocument = async (projectId, stageId, docKey) => {
  try {
    const { data } = await api.delete(
      `/projects/${projectId}/stages/${stageId}/docs/${docKey}`,
    );

    return data;
  } catch (error) {
    return normalizeError(error, "Delete Stage Document Error");
  }
};

export const submitStage = async (projectId, stageOrder) => {
  try {
    const { data } = await api.post(
      `/workflow/submit/${projectId}/${stageOrder}`,
    );

    return data;
  } catch (error) {
    return normalizeError(error, "Submit Stage Error");
  }
};

export const approveStage = async (projectId, stageOrder) => {
  try {
    const { data } = await api.post(
      `/workflow/approve/${projectId}/${stageOrder}`,
    );

    return data;
  } catch (error) {
    return normalizeError(error, "Approve Stage Error");
  }
};

export const rejectStage = async (projectId, stageOrder, reason) => {
  try {
    const { data } = await api.post(
      `/workflow/reject/${projectId}/${stageOrder}`,
      { reason },
    );

    return data;
  } catch (error) {
    return normalizeError(error, "Reject Stage Error");
  }
};

export const createTask = async (payload) => {
  try {
    const { data } = await api.post("/tasks", payload);

    return data;
  } catch (error) {
    return normalizeError(error, "Create Task Error");
  }
};

export const getTasks = async (projectId, stageOrder) => {
  try {
    const { data } = await api.get(
      `/tasks/project/${projectId}/stage/${stageOrder}`,
    );

    return data;
  } catch (error) {
    return normalizeError(error, "Task Retrieval Error");
  }
};

export const updateTask = async (taskId, payload) => {
  try {
    const { data } = await api.patch(`/tasks/${taskId}`, payload);

    return data;
  } catch (error) {
    return normalizeError(error, "Task Update Error");
  }
};

export const deleteTask = async (taskId) => {
  try {
    const { data } = await api.delete(`/tasks/${taskId}`);

    return data;
  } catch (error) {
    return normalizeError(error, "Delete Task Error");
  }
};

export const getReminders = async () => {
  try {
    const { data } = await api.get("/reminders/my");

    return data;
  } catch (error) {
    // Previously logged as "Delete Task Error" — a copy/paste leftover that
    // made reminder failures untraceable.
    return normalizeError(error, "Reminder Retrieval Error");
  }
};

export default api;
