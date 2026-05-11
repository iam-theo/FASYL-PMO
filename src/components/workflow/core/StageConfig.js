/**
 * StageConfig.js
 * SINGLE SOURCE OF TRUTH for PMO workflow engine
 */

export const StageConfig = {
  2: {
    id: 2,
    name: "Client Engagement",
    model: "Stage2ClientEngagement",
    role: "PROJECTMANAGER",

    checklist: [
      { key: "rfpReviewed", label: "RFP Reviewed", required: true },
      { key: "technicalAssessment", label: "Technical Assessment Completed", required: true },
      { key: "proposalSubmitted", label: "Proposal Submitted", required: true },
      { key: "proposalApproved", label: "Proposal Approved", required: false },
      { key: "awardReceived", label: "Award Received", required: true },
      { key: "termsAgreed", label: "Terms Agreed", required: true }
    ],

    documents: [
      { key: "rfpDoc", label: "RFP Document", required: true },
      { key: "proposalDoc", label: "Proposal Document", required: true }
    ],

    nextStage: 3
  },

  3: {
    id: 3,
    name: "Initiation",
    model: "Stage3Initiation",
    role: "PROJECTMANAGER",

    checklist: [
      { key: "awardLetterOnFile", label: "Award Letter Available", required: true },
      { key: "invoiceIssued", label: "Invoice Issued", required: true },
      { key: "signedScopeDoc", label: "Signed Scope Document", required: true },
      { key: "paymentReceived", label: "Payment Received", required: true }
    ],

    documents: [
      { key: "awardLetter", label: "Award Letter", required: true },
      { key: "signedContract", label: "Signed Contract", required: true }
    ],

    nextStage: 4
  },

  4: {
    id: 4,
    name: "Planning",
    model: "Stage4Planning",
    role: "PROJECTMANAGER",

    checklist: [
      { key: "charterSigned", label: "Project Charter Signed", required: true },
      { key: "projectPlanReady", label: "Project Plan Ready", required: true },
      { key: "riskDefined", label: "Risks Defined", required: true },
      { key: "kickoffHeld", label: "Kickoff Meeting Held", required: true }
    ],

    documents: [
      { key: "projectPlan", label: "Project Plan Document", required: true }
    ],

    nextStage: 5
  },

  5: {
    id: 5,
    name: "Execution",
    model: "Stage5Execution",
    role: "PROJECTMANAGER",

    checklist: [
      { key: "weeklyReports", label: "Weekly Reports Active", required: true },
      { key: "milestonesMet", label: "Milestones Met", required: true },
      { key: "issueLogActive", label: "Issue Log Active", required: true }
    ],

    documents: [
      { key: "statusReports", label: "Status Reports", required: true }
    ],

    nextStage: 6
  },

  6: {
    id: 6,
    name: "UAT",
    model: "Stage6UAT",
    role: "PROJECTMANAGER",

    checklist: [
      { key: "uatStarted", label: "UAT Started", required: true },
      { key: "defectsResolved", label: "Defects Resolved", required: true },
      { key: "clientSignoff", label: "Client Signoff", required: true }
    ],

    documents: [
      { key: "uatReport", label: "UAT Report", required: true }
    ],

    nextStage: 7
  },

  7: {
    id: 7,
    name: "Go Live",
    model: "Stage7GoLive",
    role: "PROJECTMANAGER",

    checklist: [
      { key: "readinessComplete", label: "Go-Live Readiness Complete", required: true },
      { key: "cutoverApproved", label: "Cutover Approved", required: true },
      { key: "productionLive", label: "Production Live", required: true },
      { key: "smokeTestsPassed", label: "Smoke Tests Passed", required: true }
    ],

    documents: [
      { key: "deploymentReport", label: "Deployment Report", required: true }
    ],

    nextStage: 8
  },

  8: {
    id: 8,
    name: "Closure",
    model: "Stage8Closure",
    role: "PROJECTMANAGER",

    checklist: [
      { key: "finalReportReady", label: "Final Report Ready", required: true },
      { key: "clientHandoverDone", label: "Client Handover Done", required: true },
      { key: "documentationDone", label: "Documentation Completed", required: true },
      { key: "financialClosure", label: "Financial Closure Completed", required: true }
    ],

    documents: [
      { key: "closureReport", label: "Closure Report", required: true }
    ],

    nextStage: null
  }
};

/**
 * Helper: get stage config safely
 */
export const getStageConfig = (stageId) => {
  return StageConfig[stageId] || null;
};

/**
 * Helper: get next stage
 */
export const getNextStage = (stageId) => {
  const current = StageConfig[stageId];
  if (!current?.nextStage) return null;
  return StageConfig[current.nextStage];
};