const POLICY = {
  stage_1: {
    name: "Client Identification",
    checklist:
      [
        {
          key: "clientNameConfirmed",
          title: "Client Name And Legal Entity Confirmed",
          desc: "Full registered name required",
          isRequired: true
        },
        {
          key: "industryClass",
          title: "Industry & Regulatory Classification Noted",
          desc: "Banking / Fintech / MFB / Other",
          isRequired: true
        },
        {
          key: "contactIdentified",
          title: "Point of Contact (Sponsor) Identified",
          desc: "Executive sponsor name and role",
          isRequired: true
        },
        {
          key: "initialNeedsDocumented",
          title: "Initial Needs Assessment Documented",
          desc: "Brief on client pain points / requirements",
          isRequired: true
        },
        {
          key: "confidentialitySigned",
          title: "NDA / Confidentiality Agreement Signed",
          desc: "Required before sharing any proprietary material",
          isRequired: true
        },
        {
          key: "kycAmlScreeningCompleted",
          title: "KYC / AML Screening Completed",
          desc: "Compliance clearance before engagement",
          isRequired: true
        },
        {
          key: "conflictOfInterestCleared",
          title: "Conflict Of Interest Check Cleared",
          desc: "Internal Compliance sign-off",
          isRequired: true
        },
        {
          key: "opportunityLogged",
          title: "Opportunity Logged In Pipeline Register",
          desc: "Assigned opportunity reference number",
          isRequired: false
        }
      ],
    requiredDocs: [
      {key: "nda_document", title: "NDA"},
      {key: "kyc_document", title: "KYC Form"},
      {key: "opr_document", title: "Opportunity Register"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_2: {
    name: "Client Engagement",
    checklist:
      [
        {
          key: "rfpReviewed",
          title: "RFP / Tender Document Received & Reviewed",
          desc: "Log receipt date",
          isRequired: true
        },
        {
          key: "technicalAssessment",
          title: "Technical Pre-assessment Conducted",
          desc: "Solution architect sign-off",
          isRequired: true
        },
        {
          key: "commercialProposal",
          title: "Commercial Proposal / Bid Prepared",
          desc: "Pricing reviewed by Finance",
          isRequired: true
        },
        {
          key: "proposalApproved",
          title: "Proposal Reviewed And Approved Internally",
          desc: "MD / CEO approval before submission",
          isRequired: true
        },
        {
          key: "proposalSubmitted",
          title: "Proposal Submitted To Client",
          desc: "Record submission date and version",
          isRequired: true
        },
        {
          key: "clientDemoCompleted",
          title: "Client Presentations / Demos Completed",
          desc: "Log dates and attendees",
          isRequired: false
        },
        {
          key: "awardReceived",
          title: "Award / Intent Letter Received From Client",
          desc: "Triggers formal project initiation",
          isRequired: true
        },
        {
          key: "commercialTermsAgreed",
          title: "Commercial Terms Negotiated And Agreed",
          desc: "Payment milestones, SLA, penalties",
          isRequired: true
        }
      ],
    requiredDocs: [
      {key: "proposal_document", title: "Proposal"}, 
      {key: "Award Letter", title: "Award Letter"}, 
      {key: "Commercial Terms Sheet", title: "Commercial Terms Sheet"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_3: {
    name: "Initiation",
    checklist:
      [
        {
          key: "awardLetterOnFile",
          title: "Order / Award Letter On File",
          desc: "Original signed copy required",
          isRequired: true
        },
        {
          key: "invoiceIssued",
          title: "Invoice Issued With Agreed Payment Terms",
          desc: "Must match commercial terms sheet",
          isRequired: true
        },
        {
          key: "signedScopeDoc",
          title: "Signed RFP / Project Scope Document",
          desc: "Client-countersigned copy",
          isRequired: true
        },
        {
          key: "paymentReceived",
          title: "Evidence Of Advance Payment Received",
          desc: "60% advance per policy (or waiver from GCEO)",
          isRequired: true
        },
        {
          key: "deferralObtained",
          title: "GCEO Waiver / Deferral Obtained (If Applicable)",
          desc: "Required if payment conditions deviate from policy",
          isRequired: false
        },
        {
          key: "projectSigned",
          title: "Project Initiation Form Fully Signed",
          desc: "Project Head, Legal & Compliance, Finance, Marketing",
          isRequired: true
        },
        {
          key: "projectIdAssigned",
          title: "Project ID Assigned",
          desc: "Format: [CLIENT]/[STREAM]/[SEQ]",
          isRequired: true
        },
        {
          key: "deployedToProject",
          title: "Resources Deployed To Project",
          desc: "Team roster confirmed",
          isRequired: true
        }
      ],
    requiredDocs: [
      {key:"initiation_documet", title: "Project Initiation Form"}, 
      {key:"kyc_form", title: "KYC Form"}, 
      {key:"award_letter", title: "Award Letter"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_4: {
    name: "Planning",
    checklist:
      [
        {
          key: "charterSigned",
          title: "Project Charter signed By Client",
          desc: "Scope, objectives, assumptions, exclusions",
          isRequired: true
        },
        {
          key: "projectPlanReady",
          title: "Project Plan (MS Project / Tracker) shared",
          desc: "Milestones, dependencies, critical path",
          isRequired: true
        },
        {
          key: "resourcePlanApproved",
          title: "Resource Plan Approved",
          desc: "Onsite vs remote, third-party vendors",
          isRequired: true
        },
        {
          key: "riskDefined",
          title: "Risk Register Initiated",
          desc: "Min. 5 risks identified with mitigations",
          isRequired: true
        },
        {
          key: "commPlanApproved",
          title: "Communication Plan Agreed With Client",
          desc: "Meeting cadence, escalation matrix",
          isRequired: false
        },
        {
          key: "processDefined",
          title: "Change Management Process Defined",
          desc: "CR template, approval workflow",
          isRequired: true
        },
        {
          key: "setupCompleted",
          title: "Environment Setup Checklist Completed",
          desc: "DEV / UAT / PROD access confirmed",
          isRequired: true
        },
        {
          key: "migrationPlanReviewed",
          title: "Data Migration Plan Reviewed",
          desc: "Required for core banking projects",
          isRequired: false
        },
        {
          key: "kickoffHeld",
          title: "Kick-off Meeting Held And Minuted",
          desc: "Client attendees captured",
          isRequired: true
        }
      ],
    requiredDocs: [
      {key:"project_charter", title: "Project Charter"}, 
      {key:"project_plan", title: "Project Plan"}, 
      {key:"risk_register", title: "Risk Register"},
      {key:"comms_plan", title: "Comms Plan"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_5: {
    name: "Execution",
    checklist:
      [
        {
          key: "weeklyReports",
          title: "Weekly Status Reports Issued",
          desc: "Format: RAG status, issues, next steps",
          isRequired: true
        },
        {
          key: "milestone1Signoff",
          title: "Milestone 1 Sign-Off Received",
          desc: "Client-signed delivery acceptance",
          isRequired: true
        },
        {
          key: "milestone2Signoff",
          title: "Milestone 2 Sign-Off Received",
          desc: "Client-signed delivery acceptance",
          isRequired: false
        },
        {
          key: "changeRequestsApproved",
          title: "Change Requests Logged And Approved",
          desc: "No scope changes without signed CR",
          isRequired: true
        },
        {
          key: "issueLogActive",
          title: "Issue Log Maintained And Current",
          desc: "Open issues reviewed weekly",
          isRequired: false
        },
        {
          key: "migrationCompleted",
          title: "Data Migration Completed (If Applicable)",
          desc: "Migration sign-off from client DBA",
          isRequired: false
        },
        {
          key: "trainingExecuted",
          title: "Training Plan Executed",
          desc: "Attendance register captured",
          isRequired: true
        },
        {
          key: "sitCompleted",
          title: "SIT (System Integration Testing) Completed",
          desc: "Test results report signed off",
          isRequired: true
        },
        {
          key: "preUatHandoverDone",
          title: "Pre-UAT Environment Handover Done",
          desc: "Access credentials issued to client team",
          isRequired: true
        }
      ],
    requiredDocs: [
      {key:"status_report", title: "Status Report"}, 
      {key:"cr_form", title: "CR Form"}, 
      {key:"issue_log", title: "Issue Log"},
      {key:"sit_report", title: "SIT Report"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_6: {
    name: "UAT",
    checklist:
      [
        {
          key: "uatStarted",
          title: "UAT Test Plan Approved By Client",
          desc: "Scenarios, expected outcomes, acceptance criteria",
          isRequired: true
        },
        {
          key: "uatStable",
          title: "UAT Environment Certified And Stable",
          desc: "No open P1 environment issues",
          isRequired: true
        },
        {
          key: "issuesLogCreated",
          title: "UAT Issues Log Created And Shared",
          desc: "Using UAT Issues Log template",
          isRequired: false
        },
        {
          key: "defectsResolved",
          title: "All Critical (P1) Issues Resolved",
          desc: "Zero open P1 before go-live gate",
          isRequired: true
        },
        {
          key: "issuesResolved",
          title: "High-priority (P2) Issues Resolved Or Waived",
          desc: "Client written waiver required for any P2 carryover",
          isRequired: true
        },
        {
          key: "clientSignoff",
          title: "UAT Sign-off Document Received From Client",
          desc: "Named client signatories required",
          isRequired: true
        },
        {
          key: "testCompleted",
          title: "Regression Test Completed Post-Fixes",
          desc: "Re-test evidence on file",
          isRequired: false
        }
      ],
    requiredDocs: [
      {key: "uat_test_plan", title: "UAT Test Plan"}, 
      {key: "uat_issus_log", title: "UAT Issues Log"}, 
      {key: "uat_sign_off", title: "UAT Sign-Off Form"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_7: {
    name: "Go Live",
    checklist:
      [
        {
          key: "readinessComplete",
          title: "Go-live Readiness Assessment Completed",
          desc: "All P1 UAT issues resolved",
          isRequired: true
        },
        {
          key: "cutoverApproved",
          title: "Cut-over Plan Approved",
          desc: "Rollback procedure documented",
          isRequired: true
        },
        {
          key: "productionValidated",
          title: "Production Environment Validated",
          desc: "Infra team sign-off",
          isRequired: true
        },
        {
          key: "productionLive",
          title: "Go-live Authorization From Client Obtained",
          desc: "Written approval — email or signed form",
          isRequired: true
        },
        {
          key: "cutoverExecuted",
          title: "Cut-over Executed Within Maintenance Window",
          desc: "Log start and end time",
          isRequired: true
        },
        {
          key: "smokeTestsPassed",
          title: "Smoke Tests Passed Post-Cut-Over",
          desc: "Critical transactions verified",
          isRequired: true
        },
        {
          key: "certIssuedToClient",
          title: "Go-Live Certificate Issued To Client",
          desc: "Triggers post-live support SLA",
          isRequired: true
        },
        {
          key: "periodDefined",
          title: "Hypercare / Post-Live Support Period Defined",
          desc: "Duration, team, escalation path",
          isRequired: true
        },
        {
          key: "milestoneTriggered",
          title: "Invoice Milestone Triggered",
          desc: "Based on commercial terms",
          isRequired: false
        }
      ],
    requiredDocs: [
      {key: "uat_test_plan", title: "UAT Test Plan"}, 
      {key: "uat_issus_log", title: "UAT Issues Log"}, 
      {key: "uat_sign_off", title: "UAT Sign-Off Form"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  stage_8: {
    name: "Closure",
    checklist:
      [
        {
          key: "finalReportReady",
          title: "Go-live Readiness Assessment Completed",
          desc: "All P1 UAT issues resolved",
          isRequired: true
        },
        {
          key: "clientHandoverDone",
          title: "Cut-over Plan Approved",
          desc: "Rollback procedure documented",
          isRequired: true
        },
        {
          key: "documentationDone",
          title: "Production Environment Validated",
          desc: "Infra team sign-off",
          isRequired: true
        },
        {
          key: "financialClosure",
          title: "Go-live Authorization From Client Obtained",
          desc: "Written approval — email or signed form",
          isRequired: true
        },
        {
          key: "resourceReleased",
          title: "Cut-over Executed Within Maintenance Window",
          desc: "Log start and end time",
          isRequired: true
        }
      ],
    requiredDocs: [
      {key: "uat_test_plan", title: "UAT Test Plan"}, 
      {key: "uat_issus_log", title: "UAT Issues Log"}, 
      {key: "uat_sign_off", title: "UAT Sign-Off Form"}
    ],
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
  const key = `stage_${stageId}`;
  const policy = POLICY[key];

  if (!policy) {
    throw new Error(`Invalid stageId: ${stageId}`);
  }

  return policy;
};

/**
 * =========================
 * VALIDATE CHECKLIST
 * =========================
 */
export const validateChecklist = (stageId, stageData) => {
  const policy = getPolicy(stageId);

  if (!stageData?.checklist) return false;

  return policy.checklist.every((policyItem) => {
    const item = stageData.checklist.find(
      (c) => c.key === policyItem.key
    );

    // if required → must be completed
    if (policyItem.isRequired) {
      return item?.completed === true;
    }

    // optional items don't block submission
    return true;
  });
};

/**
 * =========================
 * VALIDATE DOCUMENTS
 * =========================
 */
export const validateDocuments = (stageId, stageData) => {
  const policy = getPolicy(stageId);

  if (!policy.requiredDocs?.length) return true;

  const docs = stageData?.requiredDocs || [];

  return policy.requiredDocs.every((requiredDoc) => {
    return docs.some(
      (d) =>
        d.key === requiredDoc.key &&
        d.fileURL
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