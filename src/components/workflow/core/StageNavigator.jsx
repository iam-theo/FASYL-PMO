import React from "react";

function StageNavigator({
  stages = [],
  currentStage,
  setCurrentStage
}) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">

      {stages.map((stage, index) => {
        const isActive = currentStage === stage.status;

        return (
          <button
            key={index}
            onClick={() => setCurrentStage(stage.status)}
            className={`px-3 py-1 rounded-full text-sm border transition
              ${
                isActive
                  ? "bg-[#1B3C4A] text-white"
                  : "bg-white text-gray-600 border-gray-300"
              }
            `}
          >
            {stage.label}
          </button>
        );
      })}

    </div>
  );
}

export default StageNavigator;