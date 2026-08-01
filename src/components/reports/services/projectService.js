import { api } from "../../../api";

/**
 * Replaces both the old `projectService.js` and the duplicate
 * `projectLookupService.js.js`. That second file had a double extension, so
 * `import projectLookupService from "../services/projectLookupService"` never
 * resolved and the bundler failed on ReportForm.
 */

const BASE_URL = "/projects";

const unwrap = (response) => {
  const body = response?.data;

  if (body && typeof body === "object" && "data" in body) {
    return body.data;
  }

  return body ?? null;
};

const unwrapList = (response) => {
  const data = unwrap(response);

  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.projects)) return data.projects;

  return [];
};

export const getProjects = async ({ signal } = {}) =>
  unwrapList(await api.get(BASE_URL, { signal }));

export const getProject = async (projectId, { signal } = {}) =>
  unwrap(await api.get(`${BASE_URL}/${encodeURIComponent(projectId)}`, { signal }));

const projectService = Object.freeze({
  getProjects,
  getProject,
});

export default projectService;
