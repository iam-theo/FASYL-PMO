export const getWorkflowStatusFromStage = (stageNo) => {
  if (stageNo === 1) return "OPEN";
  if (stageNo >= 2 && stageNo <= 7) return "IN_PROGRESS";
  if (stageNo === 8) return "COMPLETED";
  return "LOCKED";
};