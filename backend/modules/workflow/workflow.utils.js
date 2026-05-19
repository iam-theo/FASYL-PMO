const stageModelMap = {
  2: "stage2ClientEngagement",
  3: "stage3Initiation",
  4: "stage4Planning",
  5: "stage5Execution",
  6: "stage6UAT",
  7: "stage7GoLive",
  8: "stage8Closure",
};

/**
 * =========================
 * GET PRISMA MODEL NAME
 * =========================
 */
function getStageModel(stageId) {
  return stageModelMap[stageId] || null;
}

/**
 * =========================
 * VALIDATE STAGE EXISTS
 * =========================
 */
function isValidStage(stageId) {
  return Boolean(stageModelMap[stageId]);
}

module.exports = {
  getStageModel,
  isValidStage,
};