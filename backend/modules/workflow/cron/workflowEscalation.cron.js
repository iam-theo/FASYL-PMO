import cron from "node-cron";
import dotenv from "dotenv";
import path from "path";
import { prisma } from "../../../prisma/prisma.client.js";

/* =========================
   ENV SAFETY (CRITICAL)
========================= */
dotenv.config({
  path: path.resolve(process.cwd(), "backend/.env"),
});

/* =========================
   CONFIGURATION
========================= */
const ESCALATION_THRESHOLD_HOURS = 24;
const CRON_SCHEDULE = "0 * * * *"; // every hour

/* =========================
   ESCALATION LOGIC
========================= */
const runEscalationCheck = async () => {
  console.log("🔄 Running workflow escalation check...");

  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - ESCALATION_THRESHOLD_HOURS);

    const pendingApprovals = await prisma.projectApproval.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: cutoffDate },
      },
      include: {
        project: true,
      },
    });

    if (!pendingApprovals.length) {
      console.log("✅ No escalations required");
      return;
    }

    console.log(`⚠️ Found ${pendingApprovals.length} stale approvals`);

    for (const approval of pendingApprovals) {
      const { projectId, stage, id: approvalId } = approval;

      /* =========================
         PREVENT DUPLICATE ESCALATION
      ========================= */
      const alreadyEscalated = await prisma.escalation.findFirst({
        where: {
          projectId,
          stage,
          reason: "Approval timeout exceeded 24 hours",
        },
      });

      if (alreadyEscalated) {
        console.log(`⏭ Skipping duplicate escalation for Project ${projectId}`);
        continue;
      }

      /* =========================
         CREATE ESCALATION
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
  } catch (err) {
    console.error("❌ Escalation Job Failed:", err);
  }
};

/* =========================
   START CRON
========================= */
export const startWorkflowEscalationCron = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    await runEscalationCheck();
  });

  console.log("⏰ Workflow escalation cron started (hourly)");
};