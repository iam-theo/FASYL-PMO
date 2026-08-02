import ReportStatCards from "./ReportStatCards";
import LifecycleTracker from "./LifecycleTracker";
import DonutChart from "./DonutChart";
import TaskCompletionTrend from "./TaskCompletionTrend";
import UpcomingTaskReminder from "./UpcomingTaskReminder";
import { SquareChartGantt } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TASK_STATUS_ITEMS = [
  { label: "Completed", color: "#34C759", count: 42, percent: 62 },
  { label: "In Progress", color: "#08F", count: 12, percent: 21 },
  { label: "Pending", color: "#FF8D28", count: 10, percent: 12 },
  { label: "Overdue", color: "#FF383C", count: 10, percent: 6 },
];

const RESOURCE_ALLOCATION_ITEMS = [
  { label: "Project Manager", color: "#34C759", count: 42, percent: 62 },
  { label: "Developers", color: "#08F", count: 12, percent: 21 },
  { label: "Designer", color: "#FF8D28", count: 10, percent: 12 },
  { label: "Others", color: "#FF383C", count: 10, percent: 6 },
];

function ReportsTab() {
  const navigate = useNavigate();
  return (
    <div className="ml-5 flex flex-col gap-6 px-4 py-4">
      <button
        onClick={() => navigate("/app/reports")}
        className="self-end cursor-pointer px-4 py-2 rounded-md bg-[#1B3C4A] text-white hover:bg-[#092b3a] flex gap-3 w-50"
      >
        <SquareChartGantt className="self-center" />
        Manage Reports
      </button>
      <LifecycleTracker />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart title="Task Status Overview" items={TASK_STATUS_ITEMS} />
        <TaskCompletionTrend />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTaskReminder />
        <DonutChart
          title="Resource Allocation"
          items={RESOURCE_ALLOCATION_ITEMS}
        />
      </div>
    </div>
  );
}

export default ReportsTab;
