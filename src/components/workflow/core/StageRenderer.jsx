import React from "react";
import StageChecklist from "./StageChecklist";
import StageFileUpload from "./StageFileUpload";

function StageRenderer({
  project,
  stageConfig,
  user,
  toggleChecklist,
  preview,
  setPreview
}) {
  if (!project || !stageConfig) return null;

  const stageData =
    project.stageData?.[project.currentStage] || {
      checklist: [],
      documents: []
    };

  return (
    <div className="flex flex-col gap-6">

      {/* =========================
          STAGE DESCRIPTION
      ========================== */}
      <div className="bg-[#F9FAFB] border border-[#0000000D] rounded-lg p-4">
        <h3 className="text-lg font-semibold text-[#1B3C4A]">
          {stageConfig.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Complete all required checklist items and upload documents before submission.
        </p>
      </div>

      {/* =========================
          CHECKLIST SECTION
      ========================== */}
      <div>
        <h4 className="font-semibold text-[#090909] mb-3">
          Checklist
        </h4>

        <StageChecklist
          checklist={stageConfig.checklist}
          stageData={stageData}
          project={project}
          toggleChecklist={toggleChecklist}
        />
      </div>

      {/* =========================
          FILE UPLOAD SECTION
      ========================== */}
      <div>
        <h4 className="font-semibold text-[#090909] mb-3">
          Required Documents
        </h4>

        <StageFileUpload
          documents={stageConfig.documents}
          stageData={stageData}
          project={project}
          preview={preview}
          setPreview={setPreview}
        />
      </div>

      {/* =========================
          PROGRESS SUMMARY
      ========================== */}
      <div className="grid grid-cols-2 gap-3">

        <div className="p-4 bg-[#F3F3F3] border border-[#0000000D] rounded-lg">
          <p className="text-lg font-semibold text-[#090909]">
            {stageConfig.checklist.length}
          </p>
          <p className="text-sm text-gray-500">
            Total Checklist Items
          </p>
        </div>

        <div className="p-4 bg-[#F3F3F3] border border-[#0000000D] rounded-lg">
          <p className="text-lg font-semibold text-[#090909]">
            {stageConfig.documents.length}
          </p>
          <p className="text-sm text-gray-500">
            Required Documents
          </p>
        </div>

      </div>
    </div>
  );
}

export default StageRenderer;