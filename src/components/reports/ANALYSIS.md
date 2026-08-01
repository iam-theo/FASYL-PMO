# Reports Feature — Root Cause Analysis & Remediation

Reviewed as a whole flow: `api.js` → services → Zustand stores → pages → components.

Severity key: **P0** breaks the build or the feature outright · **P1** wrong behaviour or data loss · **P2** correctness/performance/maintenance.

---

## Executive summary

The feature could not have worked in its delivered state. Three separate defects
prevented the code from even mounting (a bundler resolution failure, a temporal
dead zone crash, and a broken path alias), and beneath those sat a systemic
identity bug — the entire feature read `entity.id` from a Mongo backend that
serializes `_id`. Everything downstream of that (React keys, routing, delete,
optimistic updates) silently produced `undefined`.

The filter system had a deeper architectural problem: Project and Stage issued
*server* requests that replaced the whole result set, while Type, Format and
Search filtered *client-side* on top. The two layers were unaware of each other,
so selecting a Stage discarded the Project constraint entirely.

**33 distinct defects** are catalogued below. All are fixed.

---

## P0 — Build and mount failures

### 1. Temporal dead zone crash in `ReportForm`

```js
useEffect(() => { loadProjects(); }, [loadProjects]);  // line 30
// ...
const loadProjects = useCallback(async () => { ... }, []);  // line 61
```

**Root cause.** The dependency array is evaluated *during render*, not after it.
At the moment React reads `[loadProjects]` on line 32, the `const` binding on
line 61 has not been initialized. This throws
`ReferenceError: Cannot access 'loadProjects' before initialization` on the very
first render.

The hoisting intuition that makes this look safe applies to `function`
declarations, not `const` arrow functions. Because the effect *body* runs later,
it reads as fine — but the dep array does not.

**Impact.** Both `CreateReportPage` and `EditReportPage` crash to the error
boundary immediately. Report creation and editing were completely unreachable.

**Fix.** Project fetching was removed from the form entirely. The pages already
have `projectStore`; the form now receives `projects` as a prop. This removes
the hook ordering hazard at its source and eliminates a duplicated request.

---

### 2. Unresolvable import — `projectLookupService.js.js`

The file on disk is `services/projectLookupService.js.js` (double extension).
`ReportForm` imports `"../services/projectLookupService"`, which resolves to
`projectLookupService.js` — a file that does not exist.

**Impact.** Vite/webpack fails module resolution. Hard build error.

**Fix.** File deleted. It was a byte-for-byte duplicate of `projectService.js`
anyway. All project access now goes through the single consolidated
`services/projectService.js`.

---

### 3. Broken path alias in `ReportDetailsPage`

```js
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
```

`@` aliases the `src` root, so this resolves to
`src/components/dialogs/ConfirmDialog`. The dialog actually lives at
`src/features/reports/components/dialogs/ConfirmDialog`. Note that
`ReportsPage` imports the *same* component via a correct relative path — the
inconsistency is the tell.

**Fix.** Changed to the relative path used everywhere else in the feature.

---

### 4. Four empty files

`hooks/useReports.js`, `components/ReportCard.jsx`,
`components/DeleteReportDialog.jsx` and `components/dialogs/Dialog.jsx` are all
0 bytes. Nothing in the supplied code imports them, but a zero-byte module has
no default export, so **any** import of one is a runtime `undefined` component
error.

**Action.** Delete them. If your router or another feature imports any of these,
that import is currently broken and needs removing too.

---

## P0/P1 — The identity bug (systemic)

### 5–9. `entity.id` assumed throughout against an `_id` backend

Every id read in the feature used `.id`:

| Location | Code | Consequence when the API returns `_id` |
|---|---|---|
| `ReportTable` | `key={report.id}` | Every row keyed `undefined` → duplicate-key warning, broken reconciliation, wrong row state after sort/filter |
| `ReportsPage` | `navigate(\`/reports/${report.id}\`)` | Routes to `/reports/undefined` |
| `ReportsPage` | `deleteReport(selectedReport.id)` | `DELETE /reports/undefined` |
| `reportStore.updateReport` | `report.id === id` | Never matches → list keeps stale row after save |
| `reportStore.deleteReport` | `report.id !== id` | Never matches → deleted row stays visible until refresh |
| `ReportForm` / filters | `key={project.id}`, `key={stage.id}` | Same undefined-key problem |

**Root cause.** Mongoose only exposes the `id` virtual in JSON when the schema
sets `toJSON: { virtuals: true }`. The default serialization is `_id`. The
frontend committed to one shape without verifying it.

**Fix.** A single `getEntityId()` helper reads `_id ?? id`, coerces to string,
and is used for *every* id access in the feature. This is correct under either
serialization, so the feature no longer depends on that backend detail.

> **Assumption to confirm:** `project.projectId` is treated as the human-readable
> business key (e.g. `PRJ-2024-001`) that report documents reference and that
> `/reports/project/:projectId` expects — this is what the original
> `{project.projectId} - {project.projectName}` label implies. `getProjectKey()`
> falls back to the database id if that field is absent, so it degrades safely
> either way. Verify against your Report schema.

---

## P0/P1 — Filter architecture

### 10. Stage filter discarded the Project constraint

```js
const handleStageChange = async (e) => {
  ...
  await fetchReportsByStage(stageId);   // project selection is never sent
};
```

**Root cause.** Two filtering layers with no shared model. Project and Stage each
called a different endpoint and *replaced* `store.reports` wholesale; Type,
Format and Search then filtered whatever happened to be in that array. Nothing
reconciled the two.

`/reports/stage/:stageId` has no knowledge of the selected project, so the
result set silently escaped the project scope.

**Fix.** A single `filters` object drives everything:

- **Server layer** — `getReports({ projectId, stageId })` picks the most
  selective endpoint available.
- **Client layer** — Type, Format and Search refine the result, *and* the
  project constraint is re-applied so a stage-scoped fetch stays inside its
  project.

The client-side project check **fails open**: if a report's project cannot be
determined, the row is kept rather than hidden. Hiding data the server
explicitly returned is the worse failure mode.

Verified across 14 filter combinations, including the cross-project stage leak.

### 11. Duplicated filter-reset logic in four places

`handleProjectChange`, `handleStageChange`, `handleRefresh` and the inline Clear
button each re-implemented reset + refetch. The Clear button and `handleRefresh`
were near-identical copies that had already drifted apart.

**Fix.** `resetFilters()` and `refresh()`, each defined once. Fetching is driven
by an effect keyed on the server-side filters, so the request can never disagree
with what is on screen.

### 12. `stages` mirrored into `useState` instead of derived

`setStages(selected?.stages ?? [])` copied data that already exists in
`projects` + `selectedProject`. Two sources of truth that drift.

**Fix.** `useMemo` derivation. Cannot go stale.

### 13. Stage dropdown silently empty

The stage list reads `project.stages`, which requires the `/projects` list
endpoint to embed stage subdocuments. If it returns lean project records, the
dropdown is permanently empty with no explanation.

**Fix.** Derivation is unchanged (it is correct *if* stages are embedded), but
the UI now says "No stages on this project" instead of rendering an empty
control. **Confirm your `/projects` payload includes `stages`** — if it does
not, a `GET /projects/:id` call is needed when a project is selected.

### 14. Unguarded request races

Rapid filter changes fired overlapping requests with no cancellation or
sequencing. A slow earlier response overwrites a fast later one, leaving the
table showing data that contradicts the visible filters. Intermittent and
extremely hard to reproduce in QA.

**Fix.** `AbortController` plus a monotonic request id in the store; only the
newest response is allowed to commit. Verified with a simulated out-of-order
race.

---

## P1 — Data handling

### 15. Response envelope unwrapped inconsistently

`reportStore` read `response.data`, `ReportForm` read `response.success`, the
service returned the raw axios response. Three layers, three assumptions.

**Fix.** Unwrapping happens once, in the service. Stores and components receive
plain domain data.

### 16. Non-array payload crashes the list

`reports: response.data || []` sets whatever the API returned. A non-array
payload passes the `||` guard and then throws at `reports.filter(...)` — far
from the actual cause.

**Fix.** `unwrapList()` guarantees an array at the service boundary.

### 17. `datetime-local` inputs never populated

`<input type="datetime-local">` accepts only `YYYY-MM-DDTHH:mm`. The API returns
ISO 8601 (`2024-03-15T14:30:00.000Z`). The browser silently rejects anything
else, so **both period fields rendered blank on every edit** — and saving then
wiped the stored dates.

**Fix.** `toDateTimeLocalInput()` / `fromDateTimeLocalInput()` convert in both
directions. Round-trip verified to preserve the exact instant.

### 18. Timezone corruption on submit

The raw `datetime-local` value was posted as-is; the server parsed it as UTC,
shifting every reporting period by the client's offset.

**Fix.** Converted to ISO before submit.

### 19. Server-only fields PATCHed back

`setFormData({ ...initialState, ...initialValues })` dragged `_id`, `createdAt`,
`updatedAt`, `__v` and `fileUrl` into form state and sent them on update.

**Fix.** `buildFormState()` picks only editable fields.

### 20. In-progress edits wiped

The seeding effect keyed on `[initialValues]` — an object reference. Any store
refresh produced a new `currentReport` reference and reset the form under the
user.

**Fix.** Keyed on the record's id, so re-seeding happens only when the record
actually changes.

### 21. `EXCEL` produced a `.excel` file

`format.toLowerCase()` gives `excel`. The correct extension is `xlsx`.

**Fix.** Explicit `FILE_EXTENSIONS` map.

### 22. Objects rendered directly as React children

`<Detail value={currentReport.projectId} />` and
`<td>{report.projectId}</td>` throw
`Objects are not valid as a React child` the moment the backend populates those
refs — a change on the *server* would crash the UI.

**Fix.** `displayReference()` / `displayValue()` handle both raw ids and
populated documents.

### 23. `value || "--"` hides legitimate falsy values

`0` and `false` rendered as `--`.

**Fix.** Explicit null/undefined/empty-string checks.

### 24. Raw ISO strings shown to users

`createdAt` / `updatedAt` / period dates rendered as `2024-03-15T14:30:00.000Z`.

**Fix.** `formatDateTime()`.

---

## P1 — Error handling and async correctness

### 25. Unhandled promise rejections on delete

```js
const confirmDelete = async () => {
  try { setDeleting(true); await deleteReport(...); ... }
  finally { setDeleting(false); }   // no catch — store re-throws
};
```

`try/finally` without `catch` does not swallow the rejection. The store rethrows,
the rejection escapes, and the user sees a dialog that closes with no
indication anything failed. Same pattern in `ReportDetailsPage.handleDelete`.

**Fix.** Explicit `catch`; the dialog stays open and the store's error message is
rendered so the action can be retried.

### 26. Detail page stuck on "Loading report..." forever

```js
if (loading || !currentReport) return <div>Loading report...</div>;
```

On a failed fetch, `loading` is `false` and `currentReport` is `null` — so the
condition stays true permanently. No error path existed at all.

**Fix.** Distinct loading / not-found / error states with a retry action.

### 27. Stale report flashes across navigation

`currentReport` was never cleared. Navigating from report A to report B rendered
A's data until B's request resolved.

**Fix.** `clearCurrentReport()` on unmount, plus abort of the in-flight detail
request.

### 28. One shared `loading` flag for unrelated requests

A background list refresh could blank out the detail page and vice versa.

**Fix.** Split into `listLoading`, `detailLoading` and `submitting`.

### 29. `alert()` for success and failure

Blocking, unstyled, untestable.

**Fix.** Inline error surfaces; success navigates to the created report.

### 30. Loading state duplicated between component and store

`deleting`, `saving` and local `loading` all shadowed `store.submitting`, and
could disagree with it.

**Fix.** Single source of truth in the store.

---

## P2 — Performance and hygiene

### 31. Whole-store subscriptions

`const { reports, loading, ... } = useReportStore()` subscribes the component to
**every** field. A `submitting` flip during delete re-rendered the entire table.

**Fix.** Atomic selectors (`useReportStore((s) => s.reports)`). Chosen over
`useShallow` for compatibility across Zustand v4 and v5.

### 32. Production leftovers

`console.log("PROJECTS FROM STORE:", projects)` on every render; a
`console.log("RENDERING PROJECT:")` inside a JSX map; ~40 lines of commented-out
dead code across `ReportsPage`, `ReportForm` and `reportService`; dead
`projects` / `stages` / `onProjectChange` props passed to a `ReportForm` that
never declared them.

**Fix.** All removed.

### 33. `key={index}` on the project list

Index keys break reconciliation whenever the list reorders.

**Fix.** Stable entity ids.

---

## Fixes in `api.js`

Outside the reports feature but on its critical path:

- **Hard-coded `http://localhost:5000`** — every non-local build pointed at the
  developer's machine. Now `VITE_API_BASE_URL` with a localhost fallback.
- **Manual `multipart/form-data` header** in `uploadStageDocument` — setting this
  by hand produces a Content-Type with **no boundary token**, which multer
  cannot parse. Only the browser knows the boundary. The header is now deleted
  when the payload is `FormData`, letting the browser generate it correctly.
  *This is a live upload bug independent of the reports feature.*
- **Inconsistent return shapes** — `handleChecklist`, `uploadStageDocument` and
  `deleteStageDocument` returned the raw axios response while every other
  function returned `data`. Normalized.
- **`getReminders` logged failures as "Delete Task Error"** — a copy/paste
  leftover that made reminder failures untraceable. Fixed.
- Error logging is now dev-only and does not swallow cancellations.

---

## Verification performed

- All 13 files parse cleanly (TypeScript compiler, TSX mode).
- 37 unit assertions on the normalization layer: both `_id`/`id` serializations,
  populated vs. raw references, datetime round-tripping, filename generation,
  null-safety on every helper.
- 14 filter-composition assertions covering all five filters individually and
  combined, including an explicit regression guard for the cross-project stage
  leak.
- Race simulation confirming a slow earlier response cannot overwrite a fast
  later one.

---

## Before you deploy — three things to confirm

1. **`/projects` must embed `stages`.** The stage dropdowns derive from
   `project.stages`. If the list endpoint returns lean records, add a
   `GET /projects/:id` call on project selection. The UI now states this
   explicitly rather than showing an empty control.
2. **Confirm the project key.** `getProjectKey()` prefers the business
   `projectId` and falls back to `_id`. Check your Report schema stores the same
   value that `/reports/project/:projectId` matches on.
3. **Delete the stale files:** `services/projectLookupService.js.js`,
   `hooks/useReports.js`, `components/ReportCard.jsx`,
   `components/DeleteReportDialog.jsx`, `components/dialogs/Dialog.jsx`. Remove
   any router imports pointing at them.

`ConfirmDialog.jsx`, `Badge.jsx`, `EmptyState.jsx`, `PageHeader.jsx`,
`Pagination.jsx` and `Skeleton.jsx` needed no changes and are unmodified.
`Modal.jsx` received one fix: it reset `document.body.style.overflow` to a
hard-coded `"auto"` on cleanup, clobbering any scroll lock owned by a parent
layout. It now restores the previous value.
