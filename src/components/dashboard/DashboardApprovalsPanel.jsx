import React, { useMemo } from "react";

function groupByStage(approvals) {
  return approvals.reduce((acc, item) => {
    const stage = item.stage || 0;

    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(item);

    return acc;
  }, {});
}

function DashboardApprovalsPanel({ approvals }) {
  const grouped = useMemo(() => groupByStage(approvals || []), [approvals]);

  const stageKeys = Object.keys(grouped).sort((a, b) => a - b);

  if (!approvals || approvals.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-4 text-gray-500">
        No pending stage approvals
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="font-semibold text-[#1B3C4A]">
          Stage Approval Overview
        </h2>
        <p className="text-sm text-gray-500">
          Grouped by workflow stage
        </p>
      </div>

      {/* STAGES */}
      <div className="flex flex-col gap-5">

        {stageKeys.map((stage) => (
          <div key={stage} className="border rounded-lg p-3 bg-gray-50">

            {/* STAGE HEADER */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-[#1B3C4A]">
                Stage {stage}
              </h3>

              <span className="text-xs text-gray-500">
                {grouped[stage].length} pending
              </span>
            </div>

            {/* ITEMS */}
            <div className="flex flex-col gap-2">

              {grouped[stage].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border rounded-md p-2"
                >

                  {/* LEFT */}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-[#1B3C4A]">
                      Project #{item.projectId}
                    </p>

                    <p className="text-xs text-gray-500">
                      Waiting HEADOFOPS approval
                    </p>
                  </div>

                  {/* STATUS BADGE */}
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                    PENDING
                  </span>

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default DashboardApprovalsPanel;