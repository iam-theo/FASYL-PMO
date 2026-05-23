const POLICY = {
  client_identification: {
    name: "Client Identification",
    key: "client_identification",
    order: 1,
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

  client_engagement: {
    name: "Client Engagement",
    key: "client_engagement",
    order: 2,
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
      {key: "award_letter", title: "Award Letter"}, 
      {key: "commercial_terms_sheet", title: "Commercial Terms Sheet"}
    ],
    rolesAllowedToSubmit: ["PROJECTMANAGER"],
    rolesAllowedToApprove: ["HEADOFOPS"]
  },

  project_initiation: {
    name: "Project Initiation",
    key: "project_initiation",
    order: 3,
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

  project_planning: {
    name: "Project Planning",
    key: "project_planning",
    order: 4,
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

  project_execution: {
    name: "Execution & Delivery",
    key: "project_execution",
    order: 5,
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

  project_uat: {
    name: "User Acceptance Testing",
    key: "project_uat",
    order: 6,
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

  go_live: {
    name: "Go-Live & Cut-Over",
    key: "go_live",
    order: 7,
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

  project_closure: {
    name: "Closure",
    key: "project_closure",
    order: 8,
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
export const getPolicy = (stageKey) => {
  const key = stageKey;
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

  console.log("=== CHECKLIST DEBUG START ===");
  console.log("Stage Data Checklist:", stageData?.checklist);
  console.log("Policy Checklist:", policy?.checklist);

  if (!stageData?.checklist) {
    console.log("❌ Missing checklist in stageData");
    return false;
  }

  const result = policy.checklist.every((policyItem) => {
    const item = stageData.checklist.find(
      (c) => c.key === policyItem.key
    );

    const ok = policyItem.isRequired
      ? item?.completed === true
      : true;

    console.log(
      `Checklist Item: ${policyItem.key}`,
      "Found:", !!item,
      "Completed:", item?.completed,
      "Required:", policyItem.isRequired,
      "PASS:", ok
    );

    return ok;
  });

  console.log("Checklist Result:", result);
  console.log("=== CHECKLIST DEBUG END ===");

  return result;
};

/**
 * =========================
 * VALIDATE DOCUMENTS
 * =========================
 */
export const validateDocuments = (stageId, stageData) => {
  const policy = getPolicy(stageId);

  console.log("=== DOCS DEBUG START ===");
  console.log("Stage Docs:", stageData?.requiredDocs);
  console.log("Policy Docs:", policy?.requiredDocs);

  if (!policy?.requiredDocs?.length) {
    console.log("No required docs in policy → auto PASS");
    return true;
  }

  const docs = stageData?.requiredDocs || [];

  const result = policy.requiredDocs.every((requiredDoc) => {
    const match = docs.find((d) => d.key === requiredDoc.key);

    const ok = Boolean(match?.fileURL);

    console.log(
      `Doc: ${requiredDoc.key}`,
      "Found:", !!match,
      "fileURL:", match?.fileURL,
      "PASS:", ok
    );

    return ok;
  });

  console.log("Docs Result:", result);
  console.log("=== DOCS DEBUG END ===");

  return result;
};

/**
 * =========================
 * CAN SUBMIT STAGE
 * =========================
 */
export const canSubmitStage = (stageKey, stageData, role) => {
  const policy = POLICY[stageKey];

  if(!policy) return false

  console.log("=== CAN SUBMIT DEBUG START ===");
  console.log("Stage Key:", stageKey);
  console.log("User Role:", role);
  console.log("Policy Exists:", !!policy);

  if (!policy) {
    console.log("No policy found for stage");
    return false;
  }

  const roleAllowed = policy.rolesAllowedToSubmit.includes(role);
  const checklistOk = validateChecklist(stageKey, stageData);
  const docsOk = validateDocuments(stageKey, stageData);

  console.log("Role Allowed:", roleAllowed);
  console.log("Checklist OK:", checklistOk);
  console.log("Docs OK:", docsOk);

  console.log("Policy Roles:", policy.rolesAllowedToSubmit);
  console.log("=== CAN SUBMIT DEBUG END ===");

  return roleAllowed && checklistOk && docsOk;
};
/**
 * =========================
 * CAN APPROVE STAGE
 * =========================
 */
export const canApproveStage = (stageKey, stageData, role) => {
  const policy = POLICY[stageKey];
  if (!policy) return false;

  return policy.rolesAllowedToApprove.includes(role);
};

/**
 * =========================
 * EXPORT FULL POLICY
 * =========================
 */
export { POLICY };