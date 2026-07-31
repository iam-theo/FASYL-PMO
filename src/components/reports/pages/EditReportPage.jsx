import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FilePenLine, AlertTriangle } from "lucide-react";

import ReportForm from "../components/ReportForm";
import useReportStore from "../stores/reportStore";
import useProjectStore from "../stores/projectStore";

export default function EditReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentReport = useReportStore((state) => state.currentReport);
  const detailLoading = useReportStore((state) => state.detailLoading);
  const submitting = useReportStore((state) => state.submitting);
  const error = useReportStore((state) => state.error);
  const fetchReport = useReportStore((state) => state.fetchReport);
  const updateReport = useReportStore((state) => state.updateReport);
  const clearCurrentReport = useReportStore((state) => state.clearCurrentReport);

  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /**
   * Clearing on unmount stops the next report's edit screen from briefly
   * rendering this one's values while its own request is still in flight.
   */
  useEffect(() => {
    fetchReport(id).catch(() => {});

    return () => clearCurrentReport();
  }, [id, fetchReport, clearCurrentReport]);

  const handleSubmit = async (payload) => {
    try {
      await updateReport(id, payload);

      navigate(`/reports/${id}`, { replace: true });
    } catch {
      // Message surfaced from store.error.
    }
  };

  if (detailLoading && !currentReport) {
    return (
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-10 shadow">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!detailLoading && !currentReport) {
    return (
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-10 shadow text-center">
        <h2 className="text-xl font-semibold text-slate-900">
          Report not found
        </h2>

        <p className="mt-2 text-slate-500">
          {error || "This report may have been deleted."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Back to reports
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button
          type="button"
          onClick={() => navigate("/reports")}
          className="hover:text-blue-600"
        >
          Reports
        </button>

        <span>/</span>

        <span className="text-slate-900 font-medium">Edit report</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow">
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-100 p-3">
                <FilePenLine className="text-amber-600" size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Edit report
                </h1>

                <p className="mt-1 text-slate-500">
                  Update this generated report.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <AlertTriangle
                className="mt-0.5 shrink-0 text-red-600"
                size={20}
              />

              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <ReportForm
            mode="edit"
            initialValues={currentReport}
            projects={projects}
            loading={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
