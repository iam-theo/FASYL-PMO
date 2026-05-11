import React from "react";

function StageChecklist({
  checklist = [],
  stageData,
  project,
  toggleChecklist
}) {
  if (!checklist.length) {
    return (
      <p className="text-sm text-gray-500">
        No checklist items for this stage.
      </p>
    );
  }

  /**
   * Get current state of a checklist item
   */
  const getItemState = (item) => {
    const found = stageData?.checklist?.find(
      (c) => c.key === item.key
    );
    return found?.checked || false;
  };

  return (
    <div className="flex flex-col gap-2">

      {checklist.map((item, index) => {
        const isChecked = getItemState(item);

        return (
          <div
            key={index}
            onClick={() =>
              toggleChecklist(
                project.id,
                project.currentStage,
                item.key
              )
            }
            className={`flex items-start justify-between p-4 rounded-lg border cursor-pointer transition
              ${
                isChecked
                  ? "bg-green-50 border-green-200"
                  : "bg-[#F3F3F3] border-[#0000000D]"
              }
            `}
          >

            {/* LEFT SIDE */}
            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="mt-1 w-4 h-4 accent-[#1B3C4A]"
              />

              <div>
                <p className="font-medium text-sm text-[#090909]">
                  {item.label}
                </p>

                {/* Optional helper text */}
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </p>
                )}
              </div>

            </div>

            {/* RIGHT SIDE (Required Badge) */}
            {item.required && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#D20019] text-white">
                Required
              </span>
            )}

          </div>
        );
      })}

    </div>
  );
}

export default StageChecklist;