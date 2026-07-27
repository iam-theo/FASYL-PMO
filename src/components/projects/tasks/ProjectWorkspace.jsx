import React, { useState } from 'react'
import ProjectBreadcrumb from './ProjectBreadcrumb'
import ProjectSubTabs from './ProjectSubTabs'
import ProjectOnboardingEmptyState from './ProjectOnboardingEmptyState'
import ResourcesTab from './resources/ResourcesTab'
import TasksTab from './tasks/TasksTab'
import { INITIAL_TASKS } from './tasks/mockTasks'
import CalendarTab from './calender/CalendarTab'
import ViewProjectsBody from '../ViewProjectsBody';

function ProjectWorkspace({ 
    project, 
    setSelectedProject,
    projects,
    setProjects,
    user,
    onNavigateToDashboard, 
    onNavigateToProjects, 
    onProjectUpdated, 
    setIsSetupModalOpen,
    activeSubTab,
    setActiveSubTab,
    activeDetails,
    setActiveDetails
}) {
    // const [activeTab, setActiveTab] = useState("overview")
    const [tasks, setTasks] = useState(INITIAL_TASKS)

    const isSetupComplete = (project?.resources?.length ?? 0) > 0

    return (
        <div className='flex flex-col h-full'>
            <div className='px-4 pt-4'>
                <ProjectBreadcrumb
                    items={[
                        { label: "Dashboard", onClick: onNavigateToDashboard },
                        { label: "Projects", onClick: onNavigateToProjects },
                        { label: project?.projectName ?? "Project" },
                    ]}
                />
            </div>

            <div className='px-4 pt-6'>
                <ProjectSubTabs activeTab={activeSubTab} onTabChange={setActiveSubTab} />
            </div>

            <div className='flex-1 min-h-0 overflow-y-auto no-scrollbar'>
                {activeSubTab === "overview" && (
                    // !isSetupComplete ? (
                    //     <div className='p-4' />
                    // ) : (
                    //     <ProjectOnboardingEmptyState onSetupProject={() => setIsSetupModalOpen(true)} />
                    // )
                    <ProjectOnboardingEmptyState onSetupProject={() => setIsSetupModalOpen(true)} />
                )}

                {activeSubTab === "resources" && (
                    <ResourcesTab 
                        project={project}
                    />
                )}

                {activeSubTab === "tasks" && (
                    <TasksTab tasks={tasks} setTasks={setTasks} />
                )}

                {activeSubTab === "calendar" && (
                    <CalendarTab tasks={tasks} setTasks={setTasks} />
                )}

                {activeSubTab === "project_lifecycle" && (
                    <ViewProjectsBody
                        projects={projects}
                        setProjects={setProjects}
                        selectedProject={project}
                        setSelectedProject={setSelectedProject}
                        onClose={() => setActiveSubTab("overview")}
                        activeDetails={activeDetails}
                        setActiveDetails={setActiveDetails}
                        user={user}
                    />
                )}
            </div>
        </div>
    )
}

export default ProjectWorkspace
