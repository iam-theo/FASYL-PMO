import api from "../../../api/axios";

/**
 * =========================
 * STAGE ENGINE (PRISMA BACKED)
 * =========================
 */
function useStageEngine({ projects, setProjects, user, setNotification }) {

  /**
   * =========================
   * TOAST HELPER
   * =========================
   */
  const notify = (payload) => {
    setNotification?.(payload);
  };

  /**
   * =========================
   * TOGGLE CHECKLIST (LOCAL ONLY / STAGE TABLES)
   * =========================
   */
  const toggleChecklist = async (projectId, stageKey, itemId) => {
    try {
      const res = await api.patch(`/stages/checklist/toggle`, {
        projectId,
        stageKey,
        itemId,
      });

      const updatedProject = res.data.project;

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );

    } catch (err) {
      notify({
        type: "error",
        title: "Update failed",
        message: "Could not update checklist item"
      });
    }
  };

  /**
   * =========================
   * PROJECT MANAGER → SUBMIT STAGE
   * =========================
   */
  const submitStage = async (projectId, stageId) => {
    try {
      const res = await api.post(`/workflow/submit`, {
        projectId,
        stageId,
        submittedBy: user.id
      });

      const updatedProject = res.data.project;

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );

      notify({
        type: "success",
        title: "Stage submitted",
        message: "Sent for HEAD OF OPS approval"
      });

    } catch (err) {
      notify({
        type: "error",
        title: "Submission failed",
        message: err.response?.data?.message || "Could not submit stage"
      });
    }
  };

  /**
   * =========================
   * HEAD OF OPS → APPROVE STAGE
   * =========================
   */
  const approveStage = async (projectId, stageId) => {
    try {
      const res = await api.post(`/workflow/approve`, {
        projectId,
        stageId,
        approvedBy: user.id
      });

      const updatedProject = res.data.project;

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );

      notify({
        type: "success",
        title: "Stage approved",
        message: "Project advanced to next stage"
      });

    } catch (err) {
      notify({
        type: "error",
        title: "Approval failed",
        message: "Could not approve stage"
      });
    }
  };

  /**
   * =========================
   * HEAD OF OPS → REJECT STAGE
   * =========================
   */
  const rejectStage = async (projectId, stageId, reason) => {
    try {
      const res = await api.post(`/workflow/reject`, {
        projectId,
        stageId,
        rejectedBy: user.id,
        reason
      });

      const updatedProject = res.data.project;

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p))
      );

      notify({
        type: "error",
        title: "Stage rejected",
        message: "Returned to Project Manager for rework"
      });

    } catch (err) {
      notify({
        type: "error",
        title: "Rejection failed",
        message: "Could not reject stage"
      });
    }
  };

  return {
    toggleChecklist,
    submitStage,
    approveStage,
    rejectStage
  };
}

export default useStageEngine;