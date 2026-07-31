import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FilePlus, AlertTriangle } from "lucide-react";

import ReportForm from "../components/ReportForm";
import useReportStore from "../stores/reportStore";
import useProjectStore from "../stores/projectStore";
import { getEntityId } from "../utils/normalize";

export default function CreateReportPage() {
  const navigate = useNavigate();

  const createReport = useReportStore((state) => state.createReport);
  const submitting = useReportStore((state) => state.submitting);
  const error = useReportStore((state) => state.error);
  const clearError = useReportStore((state) => state.clearError);

  const projects = useProjectStore((state) => state.projects);
  const projectsLoading = useProjectStore((state) => state.loading);
  const projectsError = useProjectStore((state) => state.error);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  /**
   * The project lookup now lives in the store rather than inside ReportForm.
   * The form fetched its own list through `projectLookupService`, which is what
   * created the temporal-dead-zone crash and duplicated a request the reports
   * list had already made.
   */
  useEffect(() => {
    fetchProjects();

    return () => clearError();
  }, [fetchProjects, clearError]);

  const handleSubmit = async (payload) => {
    try {
      const report = await createReport(payload);

      const id = getEntityId(report);

      navigate(id ? `/reports/${id}` : "/reports", { replace: true });
    } catch {
      // Message is already in store.error and rendered below.
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="hover:text-blue-600 transition"
        >
          Reports
        </button>

        <span>/</span>

        <span className="text-slate-900 font-medium">Generate report</span>
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <FilePlus size={24} className="text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Generate report
                </h1>

                <p className="mt-1 text-slate-500">
                  Create a project report and export it in your preferred
                  format.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-100 transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {(error || projectsError) && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <AlertTriangle
                className="mt-0.5 shrink-0 text-red-600"
                size={20}
              />

              <p className="text-sm text-red-800">{error || projectsError}</p>
            </div>
          )}

          {projectsLoading && !projects.length ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <ReportForm
              mode="create"
              projects={projects}
              loading={submitting}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
