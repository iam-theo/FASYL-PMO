import React from "react";

function getStatusColor(status) {
  switch (status) {
    case "COMPLETED":
      return "text-green-600";
    case "REJECTED":
      return "text-red-600";
    case "SUBMITTED":
      return "text-orange-500";
    case "IN_PROGRESS":
      return "text-blue-600";
    default:
      return "text-gray-500";
  }
}

function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-[#1B3C4A] h-2 rounded-full"
        style={{ width: `${value || 0}%` }}
      />
    </div>
  );
}

function DashboardProjectsTable({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-4 text-gray-500">
        No projects available
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1B3C4A]">
          Projects Overview
        </h2>

        <span className="text-sm text-gray-500">
          {projects.length} total projects
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          {/* HEAD */}
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Project</th>
              <th>Client</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b hover:bg-gray-50 transition"
              >

                {/* PROJECT NAME */}
                <td className="py-3 font-medium text-[#1B3C4A]">
                  {project.projectName}
                </td>

                {/* CLIENT */}
                <td className="text-gray-600">
                  {project.clientName}
                </td>

                {/* STAGE */}
                <td>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    Stage {project.currentStage || 1}
                  </span>
                </td>

                {/* STATUS */}
                <td>
                  <span className={`font-medium ${getStatusColor(project.workflowStatus)}`}>
                    {project.workflowStatus}
                  </span>
                </td>

                {/* PROGRESS */}
                <td className="w-48">
                  <div className="flex flex-col gap-1">

                    <ProgressBar value={project.progressPercent} />

                    <span className="text-xs text-gray-500">
                      {project.progressPercent || 0}%
                    </span>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default DashboardProjectsTable;