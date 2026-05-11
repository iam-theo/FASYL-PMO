import { useEffect, useMemo, useState, useCallback } from "react";
import api from "../../../api/axios";

/**
 * =========================
 * DASHBOARD DATA ENGINE
 * =========================
 * - Fetches projects + approvals
 * - Derives KPIs
 * - Provides refresh capability
 */
export default function useDashboard() {
  const [projects, setProjects] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * =========================
   * FETCH DASHBOARD DATA
   * =========================
   */
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, approvalsRes, activityRes] = await Promise.all([
        api.get("/projects"),
        api.get("/workflow/pending"),
        api.get("/workflow/activity") // optional endpoint
      ]);

      setProjects(projectsRes.data?.data || []);
      setApprovals(approvalsRes.data?.data || []);
      setActivity(activityRes.data?.data || []);

    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /**
   * =========================
   * DERIVED METRICS (KPIs)
   * =========================
   */
  const stats = useMemo(() => {
    const total = projects.length;

    const active = projects.filter(
      (p) =>
        p.workflowStatus === "IN_PROGRESS" ||
        p.workflowStatus === "SUBMITTED"
    ).length;

    const completed = projects.filter(
      (p) => p.workflowStatus === "COMPLETED"
    ).length;

    const rejected = projects.filter(
      (p) => p.workflowStatus === "REJECTED"
    ).length;

    const pendingApprovals = approvals.length;

    const stageBreakdown = projects.reduce((acc, p) => {
      const stage = p.currentStage || 0;
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      active,
      completed,
      rejected,
      pendingApprovals,
      stageBreakdown
    };
  }, [projects, approvals]);

  /**
   * =========================
   * WORKFLOW INSIGHTS
   * =========================
   */
  const insights = useMemo(() => {
    const overdue = projects.filter((p) => {
      if (!p.dueDate) return false;
      return new Date(p.dueDate) < new Date() &&
             p.workflowStatus !== "COMPLETED";
    });

    const stuckProjects = projects.filter((p) =>
      p.workflowStatus === "SUBMITTED"
    );

    const highRisk = projects.filter(
      (p) => p.progressPercent < 30 && p.workflowStatus !== "COMPLETED"
    );

    return {
      overdue,
      stuckProjects,
      highRisk
    };
  }, [projects]);

  /**
   * =========================
   * ACTION HELPERS
   * =========================
   */
  const refresh = async () => {
    await fetchDashboard();
  };

  return {
    // raw data
    projects,
    approvals,
    activity,

    // state
    loading,
    error,

    // computed
    stats,
    insights,

    // actions
    refresh
  };
}