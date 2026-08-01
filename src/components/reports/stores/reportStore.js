import { create } from "zustand";

import reportService from "../services/reportService";
import { getEntityId } from "../utils/normalize";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const isAbort = (error) =>
  error?.name === "CanceledError" ||
  error?.name === "AbortError" ||
  error?.code === "ERR_CANCELED";

/**
 * Request bookkeeping lives outside the store state on purpose: it is
 * machinery, not UI state, and putting it in the store would re-render every
 * subscriber on each keystroke-driven refetch.
 */
let listController = null;
let listRequestId = 0;

let detailController = null;
let detailRequestId = 0;

const useReportStore = create((set, get) => ({
  reports: [],
  currentReport: null,

  /**
   * Split from a single `loading` flag. The list and the detail view fetch
   * independently; one shared flag meant a background list refresh could blank
   * out the detail page, and vice versa.
   */
  listLoading: false,
  detailLoading: false,
  submitting: false,

  error: null,

  clearError: () => set({ error: null }),

  clearCurrentReport: () => {
    detailController?.abort();
    detailController = null;

    set({ currentReport: null, detailLoading: false });
  },

  /**
   * Fetch the report list for the active server-side filters.
   *
   * Guards against out-of-order responses: rapid filter changes fire
   * overlapping requests, and without this a slow earlier response would
   * overwrite a fast later one, leaving the table showing data that does not
   * match the visible filters.
   */
  fetchReports: async ({ projectId = "", stageId = "" } = {}) => {
    listController?.abort();
    listController = new AbortController();

    const requestId = ++listRequestId;

    set({ listLoading: true, error: null });

    try {
      const reports = await reportService.getReports({
        projectId,
        stageId,
        signal: listController.signal,
      });

      if (requestId !== listRequestId) return get().reports;

      set({ reports, listLoading: false });

      return reports;
    } catch (error) {
      if (isAbort(error)) return get().reports;

      if (requestId !== listRequestId) return get().reports;

      set({
        reports: [],
        listLoading: false,
        error: getErrorMessage(error, "Couldn't load reports. Try again."),
      });

      throw error;
    }
  },

  fetchReport: async (id) => {
    if (!id) return null;

    detailController?.abort();
    detailController = new AbortController();

    const requestId = ++detailRequestId;

    set({ detailLoading: true, error: null });

    try {
      const report = await reportService.getReport(id, {
        signal: detailController.signal,
      });

      if (requestId !== detailRequestId) return get().currentReport;

      set({ currentReport: report ?? null, detailLoading: false });

      return report;
    } catch (error) {
      if (isAbort(error)) return get().currentReport;

      if (requestId !== detailRequestId) return get().currentReport;

      set({
        currentReport: null,
        detailLoading: false,
        error: getErrorMessage(error, "Couldn't load this report."),
      });

      throw error;
    }
  },

  createReport: async (payload) => {
    set({ submitting: true, error: null });

    try {
      const report = await reportService.createReport(payload);

      set((state) => ({
        reports: report ? [report, ...state.reports] : state.reports,
        submitting: false,
      }));

      return report;
    } catch (error) {
      set({
        submitting: false,
        error: getErrorMessage(error, "Couldn't generate the report."),
      });

      throw error;
    }
  },

  updateReport: async (id, payload) => {
    set({ submitting: true, error: null });

    try {
      const report = await reportService.updateReport(id, payload);

      const target = String(id);

      set((state) => ({
        // Matching used to compare `report.id === id`, which never matched
        // when the API serializes `_id`, so the list silently kept stale rows.
        reports: state.reports.map((item) =>
          getEntityId(item) === target ? (report ?? item) : item,
        ),
        currentReport: report ?? state.currentReport,
        submitting: false,
      }));

      return report;
    } catch (error) {
      set({
        submitting: false,
        error: getErrorMessage(error, "Couldn't update the report."),
      });

      throw error;
    }
  },

  deleteReport: async (id) => {
    set({ submitting: true, error: null });

    try {
      await reportService.deleteReport(id);

      const target = String(id);

      set((state) => ({
        reports: state.reports.filter((item) => getEntityId(item) !== target),
        currentReport:
          getEntityId(state.currentReport) === target ? null : state.currentReport,
        submitting: false,
      }));

      return true;
    } catch (error) {
      set({
        submitting: false,
        error: getErrorMessage(error, "Couldn't delete the report."),
      });

      throw error;
    }
  },
}));

export default useReportStore;
