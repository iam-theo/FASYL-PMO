import React from "react";

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col gap-1 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className={`text-2xl font-semibold ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-5 gap-4">

      <StatCard
        label="Total Projects"
        value={stats.total}
        color="text-[#1B3C4A]"
      />

      <StatCard
        label="Active"
        value={stats.active}
        color="text-blue-600"
      />

      <StatCard
        label="Completed"
        value={stats.completed}
        color="text-green-600"
      />

      <StatCard
        label="Rejected"
        value={stats.rejected}
        color="text-red-600"
      />

      <StatCard
        label="Pending Approvals"
        value={stats.pendingApprovals}
        color="text-orange-600"
      />

    </div>
  );
}

export default DashboardStats;