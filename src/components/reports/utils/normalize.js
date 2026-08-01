/**
 * Normalization helpers.
 *
 * The backend is Mongo/Mongoose based, which means documents may be serialized
 * either as `_id` (default) or `id` (when `toJSON: { virtuals: true }` is set).
 * The previous implementation assumed `id` everywhere, which silently produced
 * `undefined` React keys, `/reports/undefined` routes and store updates that
 * never matched. Every id read in this feature now goes through `getEntityId`
 * so the UI is correct under either serialization.
 */

/**
 * Resolve the database identifier of an entity.
 * Accepts a raw id string, a populated document, or null.
 */
export const getEntityId = (entity) => {
  if (entity === null || entity === undefined) return null;

  if (typeof entity === "string" || typeof entity === "number") {
    return String(entity);
  }

  const id = entity._id ?? entity.id ?? null;

  return id === null ? null : String(id);
};

/**
 * Resolve the business key used by the reports API for a project.
 *
 * Projects carry a human readable `projectId` (e.g. "PRJ-2024-001") which is
 * what report documents reference and what `/reports/project/:projectId`
 * expects. We fall back to the database id when the field is absent.
 */
export const getProjectKey = (project) => {
  if (project === null || project === undefined) return null;

  if (typeof project === "string" || typeof project === "number") {
    return String(project);
  }

  return project.projectId ? String(project.projectId) : getEntityId(project);
};

/**
 * Every key a report's project reference could reasonably match against.
 * Used for fail-open client side scoping (see `matchesProject`).
 */
export const getProjectCandidateKeys = (reference) => {
  if (reference === null || reference === undefined) return [];

  if (typeof reference === "string" || typeof reference === "number") {
    return [String(reference)];
  }

  return [reference.projectId, reference._id, reference.id]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .map(String);
};

/**
 * Client side project scoping.
 *
 * Fails open on purpose: if we cannot determine the report's project we keep
 * the row rather than hiding data the server explicitly returned to us.
 */
export const matchesProject = (report, projectKey) => {
  if (!projectKey) return true;

  const candidates = getProjectCandidateKeys(report?.projectId);

  if (!candidates.length) return true;

  return candidates.includes(String(projectKey));
};

export const getProjectLabel = (project) => {
  if (!project) return "--";

  const code = project.projectId;
  const name = project.projectName ?? project.name;

  if (code && name) return `${code} - ${name}`;

  return name ?? code ?? getEntityId(project) ?? "--";
};

export const getStageLabel = (stage) => {
  if (!stage) return "--";

  if (typeof stage === "string") return stage;

  return (
    stage.stageName ??
    stage.name ??
    (stage.order !== undefined ? `Stage ${stage.order}` : null) ??
    getEntityId(stage) ??
    "--"
  );
};

/**
 * Render a reference field that may arrive as a raw id or a populated object.
 * Returning an object straight into JSX throws
 * "Objects are not valid as a React child".
 */
export const displayReference = (value, labeller) => {
  if (value === null || value === undefined || value === "") return "--";

  if (typeof value === "object") {
    return labeller ? labeller(value) : (getEntityId(value) ?? "--");
  }

  return String(value);
};

/** Safe display for scalar values. Preserves 0 and false. */
export const displayValue = (value) => {
  if (value === null || value === undefined || value === "") return "--";

  if (typeof value === "object") return displayReference(value);

  return String(value);
};

export const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString();
};

export const formatDateTime = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleString();
};

/**
 * ISO 8601 -> `YYYY-MM-DDTHH:mm` in local time.
 *
 * `<input type="datetime-local">` silently refuses any other format, which is
 * why the edit form previously rendered empty period fields.
 */
export const toDateTimeLocalInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

/** `YYYY-MM-DDTHH:mm` (local) -> ISO 8601 for the API. */
export const fromDateTimeLocalInput = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const FILE_EXTENSIONS = Object.freeze({
  PDF: "pdf",
  CSV: "csv",
  EXCEL: "xlsx",
});

export const FILE_TYPES = Object.freeze({
  PDF: "application/pdf",
  CSV: "text/csv",
  EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

export const slugify = (text) =>
  String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildFileName = (title, format) => {
  const slug = slugify(title);

  if (!slug) return "";

  return `${slug}.${FILE_EXTENSIONS[format] ?? "dat"}`;
};
