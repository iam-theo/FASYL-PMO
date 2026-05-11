const POLICY = {
  stage_1: {
    name: "Client Intake",
    checklist: [],
    requiredDocs: [],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_2: {
    name: "Client Engagement",
    checklist: [
      "rfpReviewed",
      "technicalAssessment",
      "proposalApproved",
      "proposalSubmitted",
      "awardReceived",
      "termsAgreed"
    ],
    requiredDocs: ["client_id_doc"],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_3: {
    name: "Initiation",
    checklist: [
      "awardLetterOnFile",
      "invoiceIssued",
      "signedScopeDoc",
      "paymentReceived"
    ],
    requiredDocs: ["engagement_doc"],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_4: {
    name: "Planning",
    checklist: [
      "charterSigned",
      "projectPlanReady",
      "riskDefined",
      "kickoffHeld"
    ],
    requiredDocs: [],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_5: {
    name: "Execution",
    checklist: [
      "weeklyReports",
      "milestonesMet",
      "issueLogActive"
    ],
    requiredDocs: [],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_6: {
    name: "UAT",
    checklist: [
      "uatStarted",
      "defectsResolved",
      "clientSignoff"
    ],
    requiredDocs: [],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_7: {
    name: "Go Live",
    checklist: [
      "readinessComplete",
      "cutoverApproved",
      "productionLive",
      "smokeTestsPassed"
    ],
    requiredDocs: [],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_8: {
    name: "Closure",
    checklist: [
      "finalReportReady",
      "clientHandoverDone",
      "documentationDone",
      "financialClosure",
      "resourceReleased"
    ],
    requiredDocs: [],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  }
};

/**
 * =========================
 * GET STAGE POLICY
 * =========================
 */
export const getPolicy = (stageId) => {
  return POLICY[`stage_${stageId}`];
};

/**
 * =========================
 * VALIDATE CHECKLIST
 * =========================
 */
export const validateChecklist = (stageId, stageData) => {
  const policy = POLICY[`stage_${stageId}`];
  if (!policy) return false;

  return policy.checklist.every(
    (field) => stageData?.[field] === true
  );
};

/**
 * =========================
 * VALIDATE DOCUMENTS
 * =========================
 */
export const validateDocuments = (stageId, stageData) => {
  const policy = POLICY[`stage_${stageId}`];
  if (!policy || !policy.requiredDocs.length) return true;

  return policy.requiredDocs.every((docKey) => {
    return stageData?.requiredDocs?.some(
      (d) => d.key === docKey && d.fileURL
    );
  });
};

/**
 * =========================
 * CAN SUBMIT STAGE
 * =========================
 */
export const canSubmitStage = (stageId, stageData, role) => {
  const policy = POLICY[`stage_${stageId}`];
  if (!policy) return false;

  const roleAllowed = policy.rolesAllowedToSubmit.includes(role);
  const checklistOk = validateChecklist(stageId, stageData);
  const docsOk = validateDocuments(stageId, stageData);

  return roleAllowed && checklistOk && docsOk;
};

/**
 * =========================
 * CAN APPROVE STAGE
 * =========================
 */
export const canApproveStage = (stageId, role) => {
  const policy = POLICY[`stage_${stageId}`];
  if (!policy) return false;

  return policy.rolesAllowedToApprove.includes(role);
};

/**
 * =========================
 * EXPORT FULL POLICY
 * =========================
 */
export { POLICY };