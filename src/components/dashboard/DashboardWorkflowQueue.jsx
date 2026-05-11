import React, { useState } from "react";
import api from "../../api/axios";

function DashboardWorkflowQueue({ approvals, refresh }) {
  const [loadingId, setLoadingId] = useState(null);

  /**
   * =========================
   * APPROVE STAGE
   * =========================
   */
  const handleApprove = async (item) => {
    try {
      setLoadingId(item.id);

      await api.post("/workflow/approve", {
        projectId: item.projectId,
        stageId: item.stage
      });

      await refresh();

    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  /**
   * =========================
   * REJECT STAGE
   * =========================
   */
  const handleReject = async (item) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      setLoadingId(item.id);

      await api.post("/workflow/reject", {
        projectId: item.projectId,
        stageId: item.stage,
        reason
      });

      await refresh();

    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[#1B3C4A]">
          Workflow Approvals Queue
        </h2>

        <span className="text-sm text-gray-500">
          {approvals?.length || 0} pending
        </span>
      </div>

      {/* EMPTY STATE */}
      {approvals.length === 0 && (
        <p className="text-gray-500 text-sm">
          No pending approvals
        </p>
      )}

      {/* LIST */}
      <div className="flex flex-col gap-2">

        {approvals.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border rounded-md p-3 bg-gray-50"
          >

            {/* LEFT INFO */}
            <div className="flex flex-col">
              <p className="font-medium text-sm">
                Project #{item.projectId}
              </p>

              <p className="text-xs text-gray-500">
                Stage {item.stage} • Pending HEADOFOPS approval
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">

              <button
                onClick={() => handleReject(item)}
                disabled={loadingId === item.id}
                className="px-3 py-1 text-sm rounded-md border border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                Reject
              </button>

              <button
                onClick={() => handleApprove(item)}
                disabled={loadingId === item.id}
                className="px-3 py-1 text-sm rounded-md bg-[#1B3C4A] text-white hover:opacity-90 disabled:opacity-50"
              >
                {loadingId === item.id ? "Processing..." : "Approve"}
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default DashboardWorkflowQueue;