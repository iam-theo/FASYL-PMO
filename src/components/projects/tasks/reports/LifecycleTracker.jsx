import { LifecycleCheckIcon } from "./icons";

const STEPS = [
  {
    key: "client_identification",
    label: "Client Identific...",
    status: "done",
  },
  { key: "engagement", label: "Engagemenent", status: "current" },
  { key: "initiation", label: "Initiation", status: "pending" },
  { key: "planning", label: "Planning", status: "pending" },
  { key: "execution", label: "Excution", status: "pending" },
  { key: "uat", label: "UAT", status: "pending" },
  { key: "go_live_1", label: "Go-Live", status: "pending" },
  { key: "go_live_2", label: "Go-Live", status: "pending" },
];

const PROGRESS_PERCENT = 68;

function StepIcon({ status }) {
  if (status === "done") {
    return <LifecycleCheckIcon />;
  }

  if (status === "current") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B3C4A]">
        <div className="h-1.5 w-1.5 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F4F7]">
      <div className="h-1.5 w-1.5 rounded-full bg-white" />
    </div>
  );
}

function LifecycleTracker() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-[#0000000D] bg-gray-50 p-4">
      <h3 className="font-semibold text-[16px]/[20px] text-[#090909]">
        Lifecycle Tracker
      </h3>

      <div className="flex min-w-max items-start gap-4 overflow-x-auto no-scrollbar pb-1 sm:min-w-0 sm:justify-between">
        {STEPS.map((step) => (
          <div
            key={step.key}
            className="flex w-20 shrink-0 flex-col items-center gap-2"
          >
            <StepIcon status={step.status} />
            <span
              className={`text-center font-medium text-[12px]/[24px] ${
                step.status === "current" ? "text-[#1B3C4A]" : "text-[#344054]"
              } ${step.status === "pending" ? "opacity-50" : ""}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="shrink-0 font-medium text-[14px]/[24px] text-[#1B3C4A]">
          Overall Lifecycle Progress
        </span>
        <div className="h-2 flex-1 rounded-full bg-[#EFEFEF]">
          <div
            className="h-2 rounded-full bg-[#08BD66]"
            style={{ width: `${PROGRESS_PERCENT}%` }}
          />
        </div>
        <span className="shrink-0 font-semibold text-[14px]/[24px] text-[#1B3C4A]">
          {PROGRESS_PERCENT}%
        </span>
      </div>
    </div>
  );
}

export default LifecycleTracker;
