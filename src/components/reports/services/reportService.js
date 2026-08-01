import { api } from "../../../api";

const BASE_URL = "/reports";

/**
 * The API responds with `{ success, message, data }`. Unwrapping happened in
 * three different places before (store, form, page) and each made a slightly
 * different assumption. It now happens exactly once, here, so every consumer
 * receives plain domain data.
 */
const unwrap = (response) => {
  const body = response?.data;

  if (body && typeof body === "object" && "data" in body) {
    return body.data;
  }

  return body ?? null;
};

/**
 * Always hand back an array. A non-array payload used to reach the store and
 * blow up later at `reports.filter(...)`, far from the actual cause.
 */
const unwrapList = (response) => {
  const data = unwrap(response);

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.reports)) return data.reports;
  if (Array.isArray(data?.results)) return data.results;

  return [];
};

/**
 * Fetch reports for the current filter combination.
 *
 * Picks the most selective endpoint available. Any remaining narrowing is done
 * client side by the store so that Project and Stage compose instead of
 * overwriting one another.
 */
export const getReports = async ({ projectId, stageId, signal } = {}) => {
  if (stageId) {
    return unwrapList(
      await api.get(`${BASE_URL}/stage/${encodeURIComponent(stageId)}`, {
        signal,
      }),
    );
  }

  if (projectId) {
    return unwrapList(
      await api.get(`${BASE_URL}/project/${encodeURIComponent(projectId)}`, {
        signal,
      }),
    );
  }

  return unwrapList(await api.get(BASE_URL, { signal }));
};

export const getReport = async (id, { signal } = {}) =>
  unwrap(await api.get(`${BASE_URL}/${encodeURIComponent(id)}`, { signal }));

export const createReport = async (payload) =>
  unwrap(await api.post(BASE_URL, payload));

export const updateReport = async (id, payload) =>
  unwrap(await api.patch(`${BASE_URL}/${encodeURIComponent(id)}`, payload));

export const deleteReport = async (id) =>
  unwrap(await api.delete(`${BASE_URL}/${encodeURIComponent(id)}`));

/** Kept for callers outside this feature. */
export const getReportsByProject = (projectId, options) =>
  getReports({ projectId, ...options });

export const getReportsByStage = (stageId, options) =>
  getReports({ stageId, ...options });

const reportService = Object.freeze({
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  getReportsByProject,
  getReportsByStage,
});

export default reportService;
