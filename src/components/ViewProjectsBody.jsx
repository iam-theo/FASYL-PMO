import React from 'react'
import ProjectLifeCycle from './ProjectLifeCycle'
import ProjectDetails from './ProjectDetails'
import { useState, useEffect, useRef } from 'react'
import { FaCheckCircle, FaTimes, FaExclamationCircle } from "react-icons/fa"

function ViewProjectsBody({ 
    projects,
    setProjects, 
    stageTemplate,
    setStageTemplate,
    selectedProject, 
    setSelectedProject,
    onClose, 
    activeDetails, 
    setActiveDetails,
    toggleChecklist,
    user,
    preview,
    setPreview
    }) {

    const [projectStages, setProjectStages] = useState({})
    const [isLoading, setisLoading] = useState(true)
    const hasFetched = useRef(false)

    const [currentStatus, setCurrentStatus] = useState(selectedProject.current_status)
    const [notification, setNotification] = useState(null)
    const [open, setOpen] = useState(true)

    const tabs = [
        { name: "project_lifecycle", label: "Project Lifecycle"},
        { name: "project_details", label: "Project Details"}
    ]

    return (
        <div className='absolute z-2000 w-full h-full bg-[#00000080] flex flex-col items-end overflow-y-auto overscroll-contain'>

            {/* ============ NOTIFICATION UI ============ */}
            {notification && (
                <div 
                    className='bg-[#FFFFFF] shadow-[#1018280D] shadow-sm rounded-lg p-4 flex items-start justify-between gap-4 absolute z-2000 top-0 mt-4 w-100 h-24.5 cursor-pointer'>
                    {
                        notification.type === "success" 
                            ? <FaCheckCircle className='text-[#D1FADF] text-2xl bg-[#1CA466] rounded-full border-2 border-[#1CA466]' /> 
                            : notification.type === "error"
                            ? <FaExclamationCircle className='text-[#e5969f] text-2xl bg-[#D20019] rounded-full border-2 border-[#D20019]' />
                            : null
                    }
                    <div className='flex-1'>
                        <p className='font-medium text-[14px]/[20px] text-[#090909] mb-1'>{notification.title}</p>
                        <p className='font-normal text-[14px]/[20px] text-[#636363]'>{notification.message}</p>
                    </div>
                    <FaTimes onClick={() => setNotification(notification => !notification)} className='text-[#000000] bg-[#C6C6C6] text-xl rounded-md border-2' />
                </div>
            )}

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
                        stageTemplate={stageTemplate} 
                        selectedProject={selectedProject} 
                        setSelectedProject={setSelectedProject} 
                        projects={projects} setProjects={setProjects} 
                        onClose={onClose} 
                        currentStatus={currentStatus} 
                        setCurrentStatus={setCurrentStatus} 
                        toggleChecklist={toggleChecklist} 
                        user={user}
                        notification={notification}
                        setNotification={setNotification}
                        preview={preview}
                        setPreview={setPreview}
                    />}

                    {activeDetails === "project_details" && <ProjectDetails selectedProject={selectedProject}/>}
                </section>
            </div>
        </div>
    )
}

export default ViewProjectsBody