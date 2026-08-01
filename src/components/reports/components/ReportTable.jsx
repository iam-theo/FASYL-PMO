import { Eye, Pencil, Trash2, Download, FileText } from "lucide-react";

import {
  getEntityId,
  getProjectLabel,
  displayReference,
  formatDate,
} from "../utils/normalize";

export default function ReportTable({
  reports = [],
  loading = false,
  hasFilters = false,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-6 w-48 rounded bg-slate-200" />

          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-14 rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm py-20">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-slate-100 p-5">
            <FileText size={48} className="text-slate-400" />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-slate-900">
            {hasFilters ? "No matching reports" : "No reports yet"}
          </h3>

          <p className="mt-2 text-slate-500 max-w-md">
            {hasFilters
              ? "Nothing matches the current filters. Clear them to see every report."
              : "Generate a report to export project progress as PDF, CSV or Excel."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Generated reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {reports.length} report{reports.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {["Title", "Project", "Type", "Format", "Generated"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {heading}
                  </th>
                ),
              )}

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {reports.map((report, index) => {
              // Falls back to the index only if the record genuinely has no id,
              // which keeps reconciliation stable instead of keying on
              // `undefined` for every row.
              const rowKey = getEntityId(report) ?? `report-${index}`;

              return (
                <tr key={rowKey} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {report.title || "Untitled report"}
                      </p>

                      {report.description && (
                        <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                          {report.description}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {/* May arrive populated; rendering the raw object throws. */}
                    {displayReference(report.projectId, getProjectLabel)}
                  </td>

                  <td className="px-6 py-4">
                    {report.type && (
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {report.type}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {report.format && (
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {report.format}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(report.generatedAt ?? report.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onView?.(report)}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
                        title="View report"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit?.(report)}
                        className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-100"
                        title="Edit report"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(report)}
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-100"
                        title="Delete report"
                      >
                        <Trash2 size={18} />
                      </button>

                      {report.fileUrl && (
                        <a
                          href={report.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={report.fileName || undefined}
                          className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-100"
                          title="Download report"
                        >
                          <Download size={18} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
