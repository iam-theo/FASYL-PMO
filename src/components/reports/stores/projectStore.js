import { create } from "zustand";

import projectService from "../services/projectService";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

let controller = null;

const useProjectStore = create((set, get) => ({
  projects: [],

  loading: false,
  loaded: false,
  error: null,

  /**
   * `force` defaults to false so the reports list, the create form and the edit
   * form can all call this on mount without triggering three identical
   * requests. The project lookup is reference data and changes rarely.
   */
  fetchProjects: async ({ force = false } = {}) => {
    const { loaded, loading, projects } = get();

    if (!force && (loaded || loading)) return projects;

    controller?.abort();
    controller = new AbortController();

    set({ loading: true, error: null });

    try {
      const result = await projectService.getProjects({
        signal: controller.signal,
      });

      set({ projects: result, loading: false, loaded: true });

      return result;
    } catch (error) {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
        return get().projects;
      }

      set({
        projects: [],
        loading: false,
        loaded: true,
        error: getErrorMessage(error, "Couldn't load projects."),
      });

      return [];
    }
  },
}));

export default useProjectStore;
