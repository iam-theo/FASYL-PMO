import { REPORT_FORMAT, getReportFormatMeta } from '../constants/report.constants';
import { formatDateRange, formatDateTime } from './date';
import { openFile } from './download';

/**
 * Turning a report into a file the user can keep.
 *
 * WHY THIS EXISTS: `format` used to be a label and nothing more. A report with
 * content but no `fileUrl` offered no download at all, so choosing "PDF" on the
 * form promised something the app never delivered.
 *
 * HONEST LIMITS — read before extending:
 *   - CSV, HTML and Markdown are produced exactly, from a Blob.
 *   - PDF opens the browser's print dialog ("Save as PDF"). Generating real PDF
 *     bytes needs a library (jsPDF/pdf-lib) that this project does not ship.
 *   - Word and Excel produce HTML with the Office MIME type and a .doc/.xls
 *     extension. Both applications open these correctly, and it needs no
 *     dependency — but they are NOT true OOXML. If you need genuine .docx/.xlsx,
 *     add `docx` and `exceljs` and replace `buildReportBlob` only.
 *
 * A report that already has `fileUrl` always wins: that is the real artefact,
 * and anything generated here would be a lesser copy of it.
 */

const EXTENSIONS = {
  [REPORT_FORMAT.PDF]: 'pdf',
  [REPORT_FORMAT.DOCX]: 'doc',
  [REPORT_FORMAT.XLSX]: 'xls',
  [REPORT_FORMAT.CSV]: 'csv',
  [REPORT_FORMAT.HTML]: 'html',
  [REPORT_FORMAT.MARKDOWN]: 'md',
};

const MIME_TYPES = {
  [REPORT_FORMAT.DOCX]: 'application/msword',
  [REPORT_FORMAT.XLSX]: 'application/vnd.ms-excel',
  [REPORT_FORMAT.CSV]: 'text/csv;charset=utf-8',
  [REPORT_FORMAT.HTML]: 'text/html;charset=utf-8',
  [REPORT_FORMAT.MARKDOWN]: 'text/markdown;charset=utf-8',
};

const slugify = (value) =>
  String(value ?? 'report')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'report';

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Label/value pairs that head every generated format.
 *
 * `includeDescription` exists because the rich formats (HTML, Word, PDF) show
 * the description as a lead paragraph under the title, where it reads properly.
 * The tabular formats have nowhere to put a lead paragraph, so it becomes a row
 * — otherwise a CSV export silently loses it.
 */
const metadataRows = (report, { includeDescription = false } = {}) => [
  ['Title', report.title],
  ...(includeDescription ? [['Description', report.description ?? '—']] : []),
  ['Project', report.projectName ?? report.projectId],
  ['Stage', report.stageName ?? (report.stageId ? `Stage ${report.stageId}` : 'Whole project')],
  ['Type', report.type],
  ['Format', getReportFormatMeta(report.format).label],
  ['Reporting period', formatDateRange(report.periodStart, report.periodEnd)],
  ['Generated', formatDateTime(report.generatedAt)],
];

const buildHtml = (report) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(report.title)}</title>
<style>
  body { font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 40px; line-height: 1.6; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; margin: 0 0 8px; }
  p.lead { color: #475569; margin: 0 0 24px; }
  table { border-collapse: collapse; margin-bottom: 28px; }
  th, td { border: 1px solid #e2e8f0; padding: 6px 12px; text-align: left; font-size: 13px; vertical-align: top; }
  th { background: #f8fafc; color: #475569; font-weight: 600; white-space: nowrap; }
  pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; margin: 0; }
  @page { margin: 18mm; }
</style>
</head>
<body>
<h1>${escapeHtml(report.title)}</h1>
${report.description ? `<p class="lead">${escapeHtml(report.description)}</p>` : ''}
<table>
${metadataRows(report)
  .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
  .join('\n')}
</table>
<h2>Report content</h2>
<pre>${escapeHtml(report.content ?? 'This report has no inline content.')}</pre>
</body>
</html>`;

const buildMarkdown = (report) =>
  [
    `# ${report.title}`,
    report.description ? `\n_${report.description}_` : '',
    '',
    ...metadataRows(report).map(([label, value]) => `- **${label}:** ${value}`),
    '',
    '---',
    '',
    '## Report content',
    '',
    report.content ?? '_This report has no inline content._',
    '',
  ].join('\n');

/** RFC 4180 quoting — content is prose and will contain commas and newlines. */
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const buildCsv = (report) =>
  [
    ['Field', 'Value'].map(csvCell).join(','),
    ...metadataRows(report, { includeDescription: true }).map((row) =>
      row.map(csvCell).join(','),
    ),
    ['Content', report.content ?? ''].map(csvCell).join(','),
  ].join('\r\n');

/**
 * Excel imports a table, not a document.
 *
 * Sharing `buildHtml` put the description in a paragraph and the content in a
 * `<pre>` — both OUTSIDE the table, so Excel either dropped them or dumped them
 * into a stray cell. Here every field is a row, and the content cell keeps its
 * line breaks via `mso-number-format` and `white-space: pre-wrap`.
 */
const buildExcelHtml = (report) => `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(report.title)}</title>
<style>
  td, th { border: 1px solid #d0d7de; padding: 6px 10px; font-family: Calibri, Arial, sans-serif; font-size: 11pt; vertical-align: top; }
  th { background: #f2f5f8; text-align: left; font-weight: 600; }
  td.content { white-space: pre-wrap; mso-number-format: "\\@"; }
</style>
</head>
<body>
<table>
<tr><th>Field</th><th>Value</th></tr>
${metadataRows(report, { includeDescription: true })
  .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
  .join('\n')}
<tr><th>Content</th><td class="content">${escapeHtml(report.content ?? '')}</td></tr>
</table>
</body>
</html>`;

/**
 * @param {import('../types').Report} report
 * @returns {{ blob: Blob, filename: string }|null} null when the format needs printing
 */
export const buildReportBlob = (report) => {
  const format = report.format?.toUpperCase();
  const extension = EXTENSIONS[format] ?? 'txt';
  const filename = `${slugify(report.title)}.${extension}`;

  if (format === REPORT_FORMAT.PDF) return null;

  const body =
    format === REPORT_FORMAT.MARKDOWN
      ? buildMarkdown(report)
      : format === REPORT_FORMAT.CSV
        ? buildCsv(report)
        : format === REPORT_FORMAT.XLSX
          ? buildExcelHtml(report)
          : buildHtml(report);

  return {
    filename,
    blob: new Blob([body], { type: MIME_TYPES[format] ?? 'text/plain;charset=utf-8' }),
  };
};

/** Saves a Blob under a chosen name and releases the object URL afterwards. */
export const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking immediately can cancel the download in Safari.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Prints the report via a hidden iframe.
 *
 * NOT `window.open`. Two reasons, and the first one is a trap:
 *
 *   1. `window.open(url, name, 'noopener,…')` returns NULL BY SPECIFICATION,
 *      even when the window opens successfully — `noopener` severs the handle.
 *      Treating that null as "popup blocked" produced a false error on every
 *      single click while the print window sat open behind it. Dropping
 *      `noopener` would fix the return value, but then the child keeps a live
 *      `window.opener` reference back into the app.
 *   2. Popup blockers stop `window.open` in plenty of legitimate cases. An
 *      iframe is same-document, so there is nothing to block.
 *
 * The frame is removed after `afterprint`, with a long timeout as a fallback
 * for browsers that never fire it. Removing it immediately after `print()`
 * cancels the job in Safari.
 *
 * @returns {boolean} false only if the DOM refused the frame entirely
 */
export const printReport = (report) => {
  try {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('title', 'Report print preview');
    frame.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';

    frame.onload = () => {
      const frameWindow = frame.contentWindow;
      if (!frameWindow) {
        frame.remove();
        return;
      }

      let removed = false;
      const cleanup = () => {
        if (removed) return;
        removed = true;
        // A short delay lets the print job take the document before it goes.
        setTimeout(() => frame.remove(), 500);
      };

      frameWindow.addEventListener?.('afterprint', cleanup, { once: true });
      frameWindow.focus();
      frameWindow.print();

      // Some browsers never fire afterprint; do not leak the node.
      setTimeout(cleanup, 60_000);
    };

    // srcdoc keeps the frame same-origin without touching document.write.
    frame.srcdoc = buildHtml(report);
    document.body.appendChild(frame);
    return true;
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error('[reports] Print failed', error);
    }
    return false;
  }
};

/**
 * The one entry point the UI calls.
 * @returns {{ ok: boolean, reason?: 'print-failed' }}
 */
export const downloadReport = (report) => {
  if (!report) return { ok: false };

  // A real uploaded artefact always beats a generated stand-in.
  if (report.fileUrl) {
    openFile(report.fileUrl);
    return { ok: true };
  }

  const file = buildReportBlob(report);
  if (!file) {
    return printReport(report) ? { ok: true } : { ok: false, reason: 'print-failed' };
  }

  saveBlob(file.blob, file.filename);
  return { ok: true };
};

/** Menu/button wording, so the action names what it will actually produce. */
export const getDownloadLabel = (report) => {
  if (report?.fileUrl) return 'Download file';
  if (report?.format?.toUpperCase() === REPORT_FORMAT.PDF) return 'Print / save as PDF';
  return `Download ${getReportFormatMeta(report?.format).label}`;
};
