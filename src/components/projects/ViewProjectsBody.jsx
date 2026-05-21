import React from 'react'
import ProjectLifeCycle from './lifecycle/ProjectLifeCycle'
import ProjectDetails from './ProjectDetails'
import { useState, useEffect, useRef } from 'react'
import { useNotification } from '../NotificationContext'

function ViewProjectsBody({ 
    projects,
    setProjects, 
    selectedProject, 
    setSelectedProject,
    onClose, 
    activeDetails, 
    setActiveDetails,
    user,
    preview,
    setPreview
    }) {

    // console.log(selectedProject);

    // const STAGES = {
    //     1: "Client ID",
    //     2: "Engagement",
    //     3: "Initiation",
    //     4: "Planning",
    //     5: "Execution",
    //     6: "UAT",
    //     7: "Go-Live",
    //     8: "Closure"
    // };

    // const setCurrentStage = (currentStage) => {
    //     return STAGES[currentStage] || "Unknown Stage";
    // };
    
    // const [projectStages, setProjectStages] = useState({})
    const [isLoading, setisLoading] = useState(true)
    const hasFetched = useRef(false)

    // const [currentStatus, setCurrentStatus] = useState(setCurrentStage(selectedProject.currentStage))
    const [open, setOpen] = useState(true)
    const { setNotification } = useNotification()

    const tabs = [
        { name: "project_lifecycle", label: "Project Lifecycle"},
        { name: "project_details", label: "Project Details"}
    ]
8
    return (
        <div className='absolute z-2000 w-full h-full bg-[#00000080] flex flex-col items-end overflow-y-auto overscroll-contain'>

            <div className='flex flex-col w-135.5 h-430 overflow-y-auto overscroll-contain bg-[#F7F7F7] px-4 py-4'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='font-semibold text-[16px]/[20px] text-[#090909]'>Project Details</h2>
                    <button onClick={onClose} className='px-4 py-2.5 rounded-lg border border-[#000000] bg-[#E8E8E8] flex items-center gap-2 cursor-pointer'>
                        <p className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>close</p>
                        <i className="fa-regular fa-circle-xmark fa-sm"></i>
                    </button>
                </div>
                
                <div className='flex items-center justify-between mb-4'>
                    {
                        tabs.map((tab) => (
                            <button 
                            key={tab.name}
                            onClick={() => setActiveDetails(tab.name)}
                            className={`rounded-lg border border-[#0000000D] w-56.25 h-10 px-4 py-2.5 font-medium text-[14px]/[20px] text-center cursor-pointer hover:text-[#1B3C4A] ${
                            activeDetails === `${tab.name}`
                            ? "bg-[#E8E8E8] text-[#1B3C4A]"
                            : "text-[#636363]"
                        }`}>{tab.label}</button>
                        ))
                    }
                </div>

                <section>
                    {activeDetails === "project_lifecycle" && 
                    <ProjectLifeCycle 
                        selectedProject={selectedProject} 
                        setSelectedProject={setSelectedProject} 
                        projects={projects} 
                        setProjects={setProjects} 
                        onClose={onClose}  
                        user={user}
                        setNotification={setNotification}
                        preview={preview}
                        setPreview={setPreview}
                    />}

                    {/* {activeDetails === "project_details" && <ProjectDetails selectedProject={selectedProject}/>} */}
                </section>
            </div>
        </div>
    )
}

export default ViewProjectsBody