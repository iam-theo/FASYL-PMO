import { useEffect, useMemo, useState } from "react";

import {
  getEntityId,
  getProjectKey,
  getProjectLabel,
  getStageLabel,
  getProjectCandidateKeys,
  toDateTimeLocalInput,
  fromDateTimeLocalInput,
  buildFileName,
  FILE_TYPES,
} from "../utils/normalize";

const EMPTY_FORM = {
  projectId: "",
  stageId: "",
  title: "",
  description: "",
  type: "PROJECT",
  format: "PDF",
  filter: "",
  fileName: "",
  fileType: FILE_TYPES.PDF,
  periodStart: "",
  periodEnd: "",
};

/**
 * Builds form state from a report document.
 *
 * Only editable fields are picked. Spreading the whole document used to drag
 * `_id`, `createdAt`, `updatedAt`, `__v` and `fileUrl` into form state, all of
 * which were then PATCHed back to the server.
 */
const buildFormState = (report) => {
  if (!report) return { ...EMPTY_FORM };

  const projectReference = report.projectId;

  return {
    projectId:
      (typeof projectReference === "object"
        ? getProjectKey(projectReference)
        : projectReference) ?? "",
    stageId: getEntityId(report.stageId) ?? "",
    title: report.title ?? "",
    description: report.description ?? "",
    type: report.type ?? "PROJECT",
    format: report.format ?? "PDF",
    filter: report.filter ?? "",
    fileName: report.fileName ?? "",
    fileType: report.fileType ?? FILE_TYPES[report.format] ?? "",
    periodStart: toDateTimeLocalInput(report.periodStart),
    periodEnd: toDateTimeLocalInput(report.periodEnd),
  };
};

export default function ReportForm({
  mode = "create",
  initialValues = null,
  projects = [],
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(() => buildFormState(initialValues));
  const [errors, setErrors] = useState({});

  const isCreate = mode === "create";

  /**
   * Re-seed only when the underlying record actually changes.
   *
   * Keying on the object identity (the previous behaviour) meant any store
   * refresh handed back a new `currentReport` reference and wiped whatever the
   * user had typed.
   */
  const initialId = getEntityId(initialValues);

  useEffect(() => {
    setFormData(buildFormState(initialValues));
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  /**
   * Stages are derived, never mirrored into state.
   *
   * The old component kept `stages` in useState and wrote to it from three
   * places, including from inside a setState updater, so the list regularly
   * disagreed with the selected project.
   */
  const stages = useMemo(() => {
    if (!formData.projectId) return [];

    const project = projects.find((item) =>
      getProjectCandidateKeys(item).includes(String(formData.projectId)),
    );

    return Array.isArray(project?.stages) ? project.stages : [];
  }, [projects, formData.projectId]);

  /**
   * In edit mode the report's stage must remain selectable even when the
   * project lookup hasn't loaded or no longer exposes that stage — otherwise
   * the select silently resets to "Select stage" and the user unknowingly
   * clears it on save.
   */
  const stageOptions = useMemo(() => {
    const options = stages.map((stage) => ({
      value: getEntityId(stage) ?? "",
      label: getStageLabel(stage),
    }));

    const current = formData.stageId;

    if (current && !options.some((option) => option.value === current)) {
      options.unshift({
        value: current,
        label: getStageLabel(initialValues?.stageId) || "Current stage",
      });
    }

    return options;
  }, [stages, formData.stageId, initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setErrors((previous) => ({ ...previous, [name]: "" }));

    // Pure updater: no side effects, safe under StrictMode double-invocation.
    setFormData((previous) => {
      const next = { ...previous, [name]: value };

      if (name === "projectId") {
        next.stageId = "";
      }

      if (name === "title") {
        next.fileName = buildFileName(value, previous.format);
      }

      if (name === "format") {
        next.fileName = buildFileName(previous.title, value);
        next.fileType = FILE_TYPES[value] ?? "";
      }

      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (isCreate && !formData.projectId) {
      nextErrors.projectId = "Select a project.";
    }

    if (!formData.stageId) {
      nextErrors.stageId = "Select a stage.";
    }

    if (!formData.title.trim()) {
      nextErrors.title = "Enter a report title.";
    }

    if (!formData.type) {
      nextErrors.type = "Select a report type.";
    }

    if (!formData.format) {
      nextErrors.format = "Select an export format.";
    }

    if (
      formData.periodStart &&
      formData.periodEnd &&
      new Date(formData.periodStart) > new Date(formData.periodEnd)
    ) {
      nextErrors.periodEnd = "The end date must fall after the start date.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) return;

    if (!validate()) return;

    const title = formData.title.trim();

    /**
     * `datetime-local` produces a bare local timestamp. Sending it raw made the
     * server parse it as UTC, shifting every reporting period by the client's
     * offset.
     */
    const payload = {
      projectId: formData.projectId,
      stageId: formData.stageId,
      title,
      description: formData.description.trim(),
      type: formData.type,
      format: formData.format,
      filter: formData.filter.trim(),
      fileName: formData.fileName.trim() || buildFileName(title, formData.format),
      fileType: formData.fileType,
      periodStart: fromDateTimeLocalInput(formData.periodStart),
      periodEnd: fromDateTimeLocalInput(formData.periodEnd),
    };

    // The project is immutable after creation; don't send it on update.
    if (!isCreate) delete payload.projectId;

    onSubmit?.(payload);
  };

  const getInputClass = (field) =>
    `w-full rounded-lg border px-4 py-3 outline-none transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
    }`;

  const projectDisplay = initialValues
    ? (typeof initialValues.projectId === "object"
        ? getProjectLabel(initialValues.projectId)
        : initialValues.projectId) || "--"
    : "--";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Project & Stage */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Project */}
        <div>
          <label
            htmlFor="report-project"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Project
          </label>

          {isCreate ? (
            <select
              id="report-project"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={getInputClass("projectId")}
            >
              <option value="">Select project</option>

              {projects.map((project) => (
                <option
                  key={getEntityId(project) ?? getProjectKey(project)}
                  value={getProjectKey(project) ?? ""}
                >
                  {getProjectLabel(project)}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              {projectDisplay}
            </div>
          )}

          {errors.projectId && (
            <p className="mt-2 text-sm text-red-600">{errors.projectId}</p>
          )}
        </div>

        {/* Stage */}
        <div>
          <label
            htmlFor="report-stage"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Stage
          </label>

          <select
            id="report-stage"
            name="stageId"
            value={formData.stageId}
            onChange={handleChange}
            disabled={isCreate && !formData.projectId}
            className={getInputClass("stageId")}
          >
            <option value="">Select stage</option>

            {stageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {isCreate && formData.projectId && !stageOptions.length && (
            <p className="mt-2 text-sm text-slate-500">
              This project has no stages yet.
            </p>
          )}

          {errors.stageId && (
            <p className="mt-2 text-sm text-red-600">{errors.stageId}</p>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="report-title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Report title
        </label>

        <input
          id="report-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Quarter One Performance Report"
          className={getInputClass("title")}
        />

        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="report-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="report-description"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What this report covers..."
          className={getInputClass("description")}
        />
      </div>

      {/* Type & Format */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="report-type"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Report type
          </label>

          <select
            id="report-type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={getInputClass("type")}
          >
            <option value="PROJECT">Project</option>
            <option value="STAGE">Stage</option>
            <option value="TEAM">Team</option>
          </select>

          {errors.type && (
            <p className="mt-2 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="report-format"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Export format
          </label>

          <select
            id="report-format"
            name="format"
            value={formData.format}
            onChange={handleChange}
            className={getInputClass("format")}
          >
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="EXCEL">Excel</option>
          </select>

          {errors.format && (
            <p className="mt-2 text-sm text-red-600">{errors.format}</p>
          )}
        </div>
      </div>

      {/* File */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="report-filename"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            File name
          </label>

          <input
            id="report-filename"
            type="text"
            name="fileName"
            value={formData.fileName}
            onChange={handleChange}
            className={getInputClass("fileName")}
          />

          <p className="mt-2 text-xs text-slate-500">
            Generated from the report title. Edit it if you need a different
            name.
          </p>
        </div>

        <div>
          <label
            htmlFor="report-filetype"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            File type
          </label>

          <input
            id="report-filetype"
            type="text"
            value={formData.fileType}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
          />
        </div>
      </div>

      {/* Filter */}
      <div>
        <label
          htmlFor="report-filter"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Filter
        </label>

        <input
          id="report-filter"
          type="text"
          name="filter"
          value={formData.filter}
          onChange={handleChange}
          placeholder="Optional report filter..."
          className={getInputClass("filter")}
        />
      </div>

      {/* Date Range */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="report-period-start"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Period start
          </label>

          <input
            id="report-period-start"
            type="datetime-local"
            name="periodStart"
            value={formData.periodStart}
            onChange={handleChange}
            className={getInputClass("periodStart")}
          />
        </div>

        <div>
          <label
            htmlFor="report-period-end"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Period end
          </label>

          <input
            id="report-period-end"
            type="datetime-local"
            name="periodEnd"
            value={formData.periodEnd}
            onChange={handleChange}
            className={getInputClass("periodEnd")}
          />

          {errors.periodEnd && (
            <p className="mt-2 text-sm text-red-600">{errors.periodEnd}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isCreate
              ? "Generating report..."
              : "Saving changes..."
            : isCreate
              ? "Generate report"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
