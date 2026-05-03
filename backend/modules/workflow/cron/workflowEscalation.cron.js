import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
   CONFIGURATION
========================= */
const ESCALATION_THRESHOLD_HOURS = 24;

/* =========================
   MAIN ESCALATION JOB
========================= */
const runEscalationCheck = async () => {
  console.log("🔄 Running workflow escalation check...");

  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - ESCALATION_THRESHOLD_HOURS);

  /* =========================
     FIND STALE APPROVALS
  ========================= */
  const pendingApprovals = await prisma.projectApproval.findMany({
    where: {
      status: "PENDING",
      createdAt: {
        lt: cutoffDate,
      },
    },
    include: {
      project: true,
    },
  });

  if (pendingApprovals.length === 0) {
    console.log("✅ No escalations required");
    return;
  }

  console.log(`⚠️ Found ${pendingApprovals.length} stale approvals`);

  for (const approval of pendingApprovals) {
    const { projectId, stage } = approval;

    /* =========================
       ESCALATE ENTRY
    ========================= */
    await prisma.escalation.create({
      data: {
        projectId,
        stage,
        level: "HIGH",
        reason: "Approval timeout exceeded 24 hours",
      },
    });

    /* =========================
       UPDATE PROJECT STATUS
    ========================= */
    await prisma.project.update({
      where: { id: projectId },
      data: {
        workflowStatus: "IN_PROGRESS",
      },
    });

    /* =========================
       AUDIT LOG
    ========================= */
    await prisma.auditLog.create({
      data: {
        projectId,
        module: "WORKFLOW_ESCALATION",
        action: "AUTO_ESCALATION",
        details: `Stage ${stage} auto-escalated due to timeout`,
      },
    });

    console.log(`🚨 Escalated Project ${projectId} - Stage ${stage}`);
  }
};

/* =========================
   SCHEDULER
========================= */
export const startWorkflowEscalationCron = () => {
  // runs every hour
  cron.schedule("0 * * * *", async () => {
    try {
      await runEscalationCheck();
    } catch (err) {
      console.error("❌ Escalation Cron Error:", err.message);
    }
  });

  console.log("⏰ Workflow escalation cron started (hourly)");
};