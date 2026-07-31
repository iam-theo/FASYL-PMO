import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, RefreshCw, FilterX, AlertTriangle } from "lucide-react";

import ReportTable from "../components/ReportTable";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import useReportStore from "../stores/reportStore";
import useProjectStore from "../stores/projectStore";
import {
  getEntityId,
  getProjectKey,
  getProjectLabel,
  getStageLabel,
  matchesProject,
} from "../utils/normalize";

const INITIAL_FILTERS = {
  projectId: "",
  stageId: "",
  type: "",
  format: "",
  search: "",
};

export default function ReportsPage() {
  const navigate = useNavigate();

  /**
   * Atomic selectors instead of destructuring the whole store. Previously
   * `const { ... } = useReportStore()` subscribed the page to every field, so
   * an unrelated `submitting` flip re-rendered the entire table.
   */
  const reports = useReportStore((state) => state.reports);
  const listLoading = useReportStore((state) => state.listLoading);
  const submitting = useReportStore((state) => state.submitting);
  const error = useReportStore((state) => state.error);
  const fetchReports = useReportStore((state) => state.fetchReports);
  const deleteReport = useReportStore((state) => state.deleteReport);
  const clearError = useReportStore((state) => state.clearError);

  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  /**
   * One filter object rather than five useStates. Clearing, resetting and
   * reasoning about filter interactions all become a single operation.
   */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [reportToDelete, setReportToDelete] = useState(null);

  // Keeps typing responsive without hand-rolled debounce timers.
  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /**
   * Project and Stage are server-side filters. Driving them from an effect
   * rather than from the onChange handlers removes the duplicated fetch logic
   * that lived in handleProjectChange / handleStageChange / handleRefresh /
   * the Clear button, and guarantees the request always matches what is
   * currently selected.
   */
  useEffect(() => {
    fetchReports({
      projectId: filters.projectId,
      stageId: filters.stageId,
    }).catch(() => {
      /* surfaced through store.error */
    });
  }, [filters.projectId, filters.stageId, fetchReports]);

  /**
   * Stages are derived from the selected project rather than mirrored into
   * their own useState. The old copy could drift out of sync with `projects`
   * and went stale whenever the project list arrived after a selection.
   */
  const stages = useMemo(() => {
    if (!filters.projectId) return [];

    const project = projects.find(
      (item) => getProjectKey(item) === filters.projectId,
    );

    return Array.isArray(project?.stages) ? project.stages : [];
  }, [projects, filters.projectId]);

  const updateFilter = useCallback((name, value) => {
    setFilters((previous) => {
      const next = { ...previous, [name]: value };

      // A stage only means something inside its project.
      if (name === "projectId") next.stageId = "";

      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    clearError();
    setFilters(INITIAL_FILTERS);
  }, [clearError]);

  const refresh = useCallback(() => {
    clearError();

    fetchReports({
      projectId: filters.projectId,
      stageId: filters.stageId,
    }).catch(() => {});
  }, [clearError, fetchReports, filters.projectId, filters.stageId]);

  /**
   * Type, Format and Search are client-side refinements layered on top of the
   * server result. The project check is repeated here so that a stage-scoped
   * fetch stays scoped to its project — `/reports/stage/:id` knows nothing
   * about the project selection, which is how the two filters used to
   * contradict each other.
   */
  const visibleReports = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase();

    return reports.filter((report) => {
      if (!matchesProject(report, filters.projectId)) return false;

      if (filters.type && report.type !== filters.type) return false;

      if (filters.format && report.format !== filters.format) return false;

      if (!keyword) return true;

      const haystack = [
        report.title,
        report.description,
        report.fileName,
        report.type,
        report.format,
        typeof report.projectId === "object"
          ? getProjectLabel(report.projectId)
          : report.projectId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [
    reports,
    deferredSearch,
    filters.projectId,
    filters.type,
    filters.format,
  ]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some(Boolean),
    [filters],
  );

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    const id = getEntityId(reportToDelete);

    if (!id) return;

    try {
      await deleteReport(id);

      setReportToDelete(null);
    } catch {
      // Store holds the message; keep the dialog open so the user can retry.
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-5 items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>

          <p className="mt-2 text-slate-500">
            Generate, manage and download project reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/reports/create")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Generate report
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          {/* Project */}
          <select
            value={filters.projectId}
            onChange={(event) => updateFilter("projectId", event.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All projects</option>

            {projects.map((project) => (
              <option
                key={getEntityId(project) ?? getProjectKey(project)}
                value={getProjectKey(project) ?? ""}
              >
                {getProjectLabel(project)}
              </option>
            ))}
          </select>

          {/* Stage */}
          <select
            value={filters.stageId}
            onChange={(event) => updateFilter("stageId", event.target.value)}
            disabled={!filters.projectId}
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">All stages</option>

            {filters.projectId && !stages.length && (
              <option value="" disabled>
                No stages on this project
              </option>
            )}

            {stages.map((stage) => (
              <option key={getEntityId(stage)} value={getEntityId(stage) ?? ""}>
                {getStageLabel(stage)}
              </option>
            ))}
          </select>

          {/* Report Type */}
          <select
            value={filters.type}
            onChange={(event) => updateFilter("type", event.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All types</option>
            <option value="PROJECT">Project</option>
            <option value="STAGE">Stage</option>
            <option value="TEAM">Team</option>
          </select>

          {/* Format */}
          <select
            value={filters.format}
            onChange={(event) => updateFilter("format", event.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All formats</option>
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="EXCEL">Excel</option>
          </select>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={refresh}
              disabled={listLoading}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 hover:bg-slate-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={listLoading ? "animate-spin" : undefined}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="flex-1 rounded-lg bg-slate-900 text-white px-4 py-2.5 hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <FilterX size={16} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={20} />

          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {/* Reports Table */}
      <ReportTable
        reports={visibleReports}
        loading={listLoading}
        hasFilters={hasActiveFilters}
        onView={(report) => navigate(`/reports/${getEntityId(report)}`)}
        onEdit={(report) => navigate(`/reports/${getEntityId(report)}/edit`)}
        onDelete={(report) => setReportToDelete(report)}
      />

      <ConfirmDialog
        open={Boolean(reportToDelete)}
        loading={submitting}
        title="Delete report"
        message={`"${reportToDelete?.title ?? "This report"}" will be permanently deleted. This can't be undone.`}
        confirmText="Delete report"
        onCancel={() => setReportToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
