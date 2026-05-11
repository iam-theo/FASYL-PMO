import React from "react";

function getIcon(action) {
  switch (action) {
    case "APPROVED":
      return "fa-circle-check text-green-600";
    case "REJECTED":
      return "fa-circle-xmark text-red-600";
    case "SUBMITTED":
      return "fa-paper-plane text-blue-600";
    case "CREATED":
      return "fa-plus text-gray-600";
    default:
      return "fa-circle-info text-gray-500";
  }
}

function formatTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString();
}

function DashboardActivityFeed({ activity }) {
  if (!activity || activity.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-4 text-gray-500">
        No recent activity
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">

      {/* HEADER */}
      <div className="mb-3">
        <h2 className="font-semibold text-[#1B3C4A]">
          Activity Feed
        </h2>
        <p className="text-sm text-gray-500">
          Latest workflow events across all projects
        </p>
      </div>

      {/* FEED */}
      <div className="flex flex-col gap-3">

        {activity.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 border-b pb-3"
          >

            {/* ICON */}
            <div className="mt-1">
              <i className={`fa-solid ${getIcon(item.action)}`} />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col">

              <p className="text-sm font-medium text-[#1B3C4A]">
                Project #{item.projectId} • {item.module || "workflow"}
              </p>

              <p className="text-sm text-gray-600">
                {item.details || item.action}
              </p>

              <span className="text-xs text-gray-400">
                {formatTime(item.createdAt)}
              </span>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default DashboardActivityFeed;