import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Pencil,
  Trash2,
  FileText,
  Calendar,
  FolderOpen,
  Layers,
  AlertTriangle,
} from "lucide-react";

// Was "@/components/dialogs/ConfirmDialog". The `@` alias points at src root,
// but this dialog lives inside the reports feature, so the import never
// resolved and the route failed to mount.
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import useReportStore from "../stores/reportStore";
import {
  displayValue,
  displayReference,
  getProjectLabel,
  getStageLabel,
  formatDateTime,
} from "../utils/normalize";

export default function ReportDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentReport = useReportStore((state) => state.currentReport);
  const detailLoading = useReportStore((state) => state.detailLoading);
  const submitting = useReportStore((state) => state.submitting);
  const error = useReportStore((state) => state.error);
  const fetchReport = useReportStore((state) => state.fetchReport);
  const deleteReport = useReportStore((state) => state.deleteReport);
  const clearCurrentReport = useReportStore((state) => state.clearCurrentReport);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchReport(id).catch(() => {});

    return () => clearCurrentReport();
  }, [id, fetchReport, clearCurrentReport]);

  const handleDelete = async () => {
    try {
      await deleteReport(id);

      setShowDeleteDialog(false);

      navigate("/reports", { replace: true });
    } catch {
      // Keep the dialog open so the error stays visible and retry is possible.
    }
  };

  if (detailLoading && !currentReport) {
    return (
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-10 shadow">
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

  /**
   * Without this branch a failed request left `loading` false and
   * `currentReport` null, so the page rendered "Loading report..." forever.
   */
  if (!currentReport) {
    return (
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-10 text-center shadow">
        <div className="mx-auto w-fit rounded-full bg-red-100 p-4">
          <AlertTriangle className="text-red-600" size={28} />
        </div>

        <h2 className="mt-6 text-xl font-semibold text-slate-900">
          Report not found
        </h2>

        <p className="mt-2 text-slate-500">
          {error || "This report may have been deleted."}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => fetchReport(id).catch(() => {})}
            className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={() => navigate("/reports")}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
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

        <span className="text-slate-900 font-medium">Details</span>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={20} />

          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow">
        <div className="flex items-center justify-between border-b border-slate-200 p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-100 p-4">
              <FileText size={28} className="text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {currentReport.title || "Untitled report"}
              </h1>

              <p className="mt-1 text-slate-500">Generated report</p>
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

        {/* Content */}
        <div className="grid gap-8 p-8 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 p-6">
            <h2 className="mb-6 text-lg font-semibold">Report information</h2>

            <Detail label="Title" value={displayValue(currentReport.title)} />

            <Detail
              label="Description"
              value={displayValue(currentReport.description)}
            />

            <Detail
              icon={<FolderOpen size={16} />}
              label="Project"
              value={displayReference(currentReport.projectId, getProjectLabel)}
            />

            <Detail
              icon={<Layers size={16} />}
              label="Stage"
              value={displayReference(currentReport.stageId, getStageLabel)}
            />
          </section>

          <section className="rounded-xl border border-slate-200 p-6">
            <h2 className="mb-6 text-lg font-semibold">Export information</h2>

            <Detail label="Type" value={displayValue(currentReport.type)} />

            <Detail label="Format" value={displayValue(currentReport.format)} />

            <Detail
              label="File name"
              value={displayValue(currentReport.fileName)}
            />

            <Detail
              label="File type"
              value={displayValue(currentReport.fileType)}
            />
          </section>

          <section className="rounded-xl border border-slate-200 p-6">
            <h2 className="mb-6 text-lg font-semibold">Reporting period</h2>

            <Detail
              icon={<Calendar size={16} />}
              label="Start"
              value={formatDateTime(currentReport.periodStart)}
            />

            <Detail
              icon={<Calendar size={16} />}
              label="End"
              value={formatDateTime(currentReport.periodEnd)}
            />
          </section>

          <section className="rounded-xl border border-slate-200 p-6">
            <h2 className="mb-6 text-lg font-semibold">Metadata</h2>

            <Detail
              label="Generated at"
              value={formatDateTime(
                currentReport.generatedAt ?? currentReport.createdAt,
              )}
            />

            <Detail
              label="Last updated"
              value={formatDateTime(currentReport.updatedAt)}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-4 border-t border-slate-200 p-8">
          {currentReport.fileUrl && (
            <a
              href={currentReport.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={currentReport.fileName || undefined}
              className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
            >
              <Download className="mr-2 inline" size={18} />
              Download
            </a>
          )}

          <button
            type="button"
            onClick={() => navigate(`/reports/${id}/edit`)}
            className="rounded-lg bg-amber-500 px-5 py-3 text-white hover:bg-amber-600"
          >
            <Pencil className="mr-2 inline" size={18} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            <Trash2 className="mr-2 inline" size={18} />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        loading={submitting}
        title="Delete report"
        message="This report will be permanently deleted. This can't be undone."
        confirmText="Delete report"
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function Detail({ label, value, icon }) {
  return (
    <div className="mb-5">
      <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </div>

      <div className="rounded-lg bg-slate-50 px-4 py-3 text-slate-800">
        {value}
      </div>
    </div>
  );
}
