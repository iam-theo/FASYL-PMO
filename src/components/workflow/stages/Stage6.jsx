import React from "react";
import StageChecklist from "../core/StageChecklist";
import StageFileUpload from "../core/StageFileUpload";

export default function Stage2({
  data,
  checklist,
  onToggle,
  onUpload,
  readonly
}) {
  return (
    <div className="flex flex-col gap-4">

      {/* =========================
          STAGE HEADER INFO
      ========================== */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">Stage 6 -  User Access Testing</h2>
        <p className="text-sm text-gray-500">
          Complete all engagement requirements before submission
        </p>
      </div>

      {/* =========================
          CHECKLIST
      ========================== */}
      <StageChecklist
        items={checklist}
        onToggle={onToggle}
        readonly={readonly}
      />

      {/* =========================
          FILE UPLOADS
      ========================== */}
      <StageFileUpload
        files={data?.files}
        onUpload={onUpload}
        readonly={readonly}
      />
    </div>
  );
}