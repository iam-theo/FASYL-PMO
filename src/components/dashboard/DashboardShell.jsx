import React from "react";
import useDashboard from "./hooks/useDashboard";

import DashboardStats from "./DashboardStats";
import DashboardProjectsTable from "./DashboardProjectsTable";
import DashboardWorkflowQueue from "./DashboardWorkflowQueue";
import DashboardActivityFeed from "./DashboardActivityFeed";
import DashboardApprovalsPanel from "./DashboardApprovalsPanel";

function DashboardShell({ user }) {
  const {
    projects,
    approvals,
    activity,
    stats,
    insights,
    loading,
    error,
    refresh,
  } = useDashboard();

  /* =========================
     LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================== */
  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">

      {/* =========================
          HEADER STRIP (optional control)
      ========================== */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1B3C4A]">
          PMO Dashboard
        </h1>

        <button
          onClick={refresh}
          className="px-3 py-1.5 text-sm rounded-md bg-[#1B3C4A] text-white hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {/* =========================
          STATS ROW
      ========================== */}
      <DashboardStats stats={stats} />

      {/* =========================
          MAIN GRID
      ========================== */}
      <div className="grid grid-cols-3 gap-4">

        {/* LEFT SECTION (CORE OPERATIONS) */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* PROJECTS TABLE */}
          <DashboardProjectsTable
            projects={projects}
          />

          {/* APPROVAL INTELLIGENCE */}
          <DashboardApprovalsPanel
            approvals={approvals}
          />

        </div>

        {/* RIGHT SECTION (OPERATIONS + FEED) */}
        <div className="flex flex-col gap-4">

          {/* WORKFLOW QUEUE */}
          <DashboardWorkflowQueue
            approvals={approvals}
            insights={insights}
          />

          {/* ACTIVITY FEED */}
          <DashboardActivityFeed
            activity={activity}
          />

        </div>

      </div>

    </div>
  );
}

export default DashboardShell;