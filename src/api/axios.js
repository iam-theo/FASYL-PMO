import axios from "axios";

/* =========================
   BASE INSTANCE
========================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://sflbk.com/api/v1",
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    /* =========================
       HANDLE 401 (TOKEN EXPIRED)
    ========================== */
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "https://sflbk.com/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.accessToken;

        if (!newToken) throw new Error("No access token returned");

        // update token
        localStorage.setItem("token", newToken);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.warn("Refresh failed - logging out user");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 🔥 SPA SAFE LOGOUT (NO RELOAD)
        window.dispatchEvent(
          new CustomEvent("auth:logout", {
            detail: { reason: "Session expired" }
          })
        );

        return Promise.reject(refreshError);
      }
    }

    /* =========================
       HANDLE 403 (FORBIDDEN)
    ========================== */
    if (status === 403) {
      console.warn("Forbidden access");

      // optional: emit toast trigger event
      window.dispatchEvent(
        new CustomEvent("auth:error", {
          detail: { message: "You do not have permission to perform this action" }
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;