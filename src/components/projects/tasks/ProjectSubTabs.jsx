import React from 'react'

export const PROJECT_WORKSPACE_TABS = [
    { key: "overview", label: "Overview" },
    { key: "resources", label: "Resources" },
    { key: "tasks", label: "Tasks" },
    { key: "kanban", label: "Kanban" },
    { key: "calendar", label: "Calendar" },
    { key: "timeline", label: "Timeline" },
    { key: "analytics", label: "Analytics" },
    { key: "project_lifecycle", label: "Project Lifecycle" },
]

function ProjectSubTabs({ activeTab, onTabChange }) {
    return (
        <div className='flex items-center gap-1'>
            {PROJECT_WORKSPACE_TABS.map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    onClick={() => onTabChange(tab.key)}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-center font-medium text-[14px]/[20px] cursor-pointer whitespace-nowrap ${
                        activeTab === tab.key
                            ? "border border-[#0000000D] bg-[#E8E8E8] text-[#1B3C4A]"
                            : "text-[#636363] hover:text-[#1B3C4A]"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export default ProjectSubTabs
