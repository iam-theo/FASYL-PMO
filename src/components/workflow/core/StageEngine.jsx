import React from "react";
import useStageEngine from "./useStageEngine";
import { getStageConfig } from "./StageConfig";
import StageRenderer from "./StageRenderer";

function StageEngine({
  project,
  projects,
  setProjects,
  user,
  setNotification,
  preview,
  setPreview
}) {
  if (!project) return null;

  /**
   * =========================
   * CORE STATE (SOURCE OF TRUTH)
   * =========================
   */
  const stageId = project.currentStage || 1;
  const stageConfig = getStageConfig(stageId);

  const {
    toggleChecklist,
    submitStage,
    approveStage,
    rejectStage
  } = useStageEngine({
    projects,
    setProjects,
    user,
    setNotification
  });

  /**
   * =========================
   * ROLE ACTION ENGINE
   * =========================
   */

  const handlePrimaryAction = () => {
    if (user.role === "PROJECTMANAGER") {
      submitStage(project.id, stageId);
    }

    if (user.role === "HEADOFOPS") {
      approveStage(project.id, stageId);
    }
  };

  const handleReject = () => {
    const reason = prompt("Enter rejection reason:");

    if (!reason || reason.trim().length < 3) {
      setNotification?.({
        type: "error",
        title: "Invalid reason",
        message: "Rejection reason is required"
      });
      return;
    }

    rejectStage(project.id, stageId, reason);
  };

  /**
   * =========================
   * SAFETY CHECK
   * =========================
   */
  if (!stageConfig) {
    return (
      <div className="p-4 text-red-500">
        Invalid stage configuration
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">

      {/* =========================
          HEADER
      ========================== */}
      <div className="flex items-center justify-between p-4 border-b border-[#0000000D] bg-[#F9FAFB]">

        <div>
          <p className="text-sm text-gray-500">
            Stage {stageId} of 8
          </p>

          <h2 className="text-lg font-semibold text-[#1B3C4A]">
            {stageConfig.name}
          </h2>

          <p className="text-xs text-gray-500">
            Status: {project.workflowStatus}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">

          {/* REJECT (HEAD ONLY) */}
          {user.role === "HEADOFOPS" && (
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm rounded-md border border-red-500 text-red-500 hover:bg-red-50"
            >
              Reject
            </button>
          )}

          {/* PRIMARY ACTION */}
          <button
            onClick={handlePrimaryAction}
            className="px-4 py-2 text-sm rounded-md bg-[#1B3C4A] text-white hover:opacity-90"
          >
            {user.role === "PROJECTMANAGER"
              ? "Submit for Approval"
              : "Approve Stage"}
          </button>

        </div>
      </div>

      {/* =========================
          BODY
      ========================== */}
      <div className="flex-1 overflow-auto p-4">

        <StageRenderer
          project={project}
          stageConfig={stageConfig}
          user={user}
          toggleChecklist={toggleChecklist}
          preview={preview}
          setPreview={setPreview}
        />

      </div>

    </div>
  );
}

export default StageEngine;