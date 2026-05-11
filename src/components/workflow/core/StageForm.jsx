import React from "react";
import StageChecklist from "./StageChecklist";
import StageFileUpload from "./StageFileUpload";
import { useStage } from "./StageContext";

function StageForm({
  stageConfig,
  project,
  onSubmit
}) {
  const {
    stageData,
    toggleChecklist,
    updateDocument,
    preview,
    setPreview
  } = useStage();

  const stageKey = stageConfig.status;
  const stageState = stageData[stageKey] || {
    checklist: stageConfig.checklist,
    documents: []
  };

  return (
    <div className="flex flex-col gap-4">

      {/* TITLE */}
      <div>
        <h2 className="text-lg font-semibold">
          {stageConfig.title}
        </h2>
        <p className="text-sm text-gray-500">
          {stageConfig.description}
        </p>
      </div>

      {/* CHECKLIST */}
      <StageChecklist
        checklist={stageConfig.checklist}
        stageData={stageState}
        project={project}
        toggleChecklist={toggleChecklist}
      />

      {/* FILE UPLOAD */}
      <StageFileUpload
        documents={stageConfig.requiredDocs}
        stageData={stageState}
        project={project}
        preview={preview}
        setPreview={setPreview}
        updateDocument={(docKey, file) =>
          updateDocument(stageKey, docKey, file)
        }
      />

      {/* SUBMIT BUTTON */}
      <button
        onClick={() => onSubmit(stageKey)}
        className="w-full bg-[#1B3C4A] text-white py-2 rounded-lg mt-3"
      >
        Submit Stage
      </button>

    </div>
  );
}

export default StageForm;