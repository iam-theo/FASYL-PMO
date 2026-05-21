import React from 'react'
import UploadBox from './UploadBox';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleChecklist } from './utils/ToggleChecklist';

function ProjectLifeCycle({ 
    selectedProject, 
    setSelectedProject, 
    projects, 
    setProjects, 
    onClose,  
    user,
    notification,
    setNotification,
    preview,
    setPreview
    }) {

        // console.log(projects)
        // console.log(selectedProject)
        // console.log(user)

    const STAGES = {
        1: "Client ID",
        2: "Engagement",
        3: "Initiation",
        4: "Planning",
        5: "Execution",
        6: "UAT",
        7: "Go-Live",
        8: "Closure"
    };

    const setCurrentStage = (currentStage) => {
        return STAGES[currentStage] || "Unknown Stage";
    };
    
    const STAGENAME = {
        1: "Client Identification",
        2: "Client Engagement",
        3: "Project Initiation",
        4: "Project Planning",
        5: "Execution & Delivery",
        6: "User Acceptance Testing",
        7: "Go-Live & Cut-Over",
        8: "Closure"
    };

    const setStageTitle = (stageName) => {
        return STAGENAME[stageName] || "Unknown Stage Name";
    };
    
    const currentStage = setCurrentStage(selectedProject.currentStage);
    const stageName = setStageTitle(selectedProject.currentStage)
    const projectStage = selectedProject.stages.find(s => s.stageName === stageName)
    console.log(projectStage)
    const nextStage = setCurrentStage((selectedProject.currentStage) + 1)
    const stageIndex = (selectedProject.currentStage) - 1;
    const length = selectedProject.stages.length
    const checklistLength = selectedProject.stages[stageIndex].checklist.length
    const required = projectStage.checklist.filter(item => item.isRequired).length
    // const completed = projectStage.checklist.filter(item => item.checked).length

    const STAGESDESC = {
        0: "Record and qualify the prospective client before any engagement begins.",
        1: "Pre-sales and proposal activities. All items must be complete before initiation.",
        2: "Mandatory pre-project documents per policy. ",
        3: "Mandatory pre-project documents per policy. ",
        4: "Track milestones and mandatory sign-offs at each delivery gate.",
        5: "Client-led testing. All critical issues must be resolved before go-live approval.",
        6: "Final production deployment. Requires all prior stage gates cleared.",
        7: "Final production deployment. Requires all prior stage gates cleared."
    };

    const setStageDesc = (stageIndex) => {
        return STAGESDESC[stageIndex] || "Unknown Stage";
    };

    const title = selectedProject.stages[stageIndex].stageName;
    const desc = setStageDesc(stageIndex);

    // const handleNextStage = (projectId) => {
    //     const isHead = user.role === "HEADOFOPS";
    //     const isPM = user.role === "PROJECTMANAGER";

    //     let shouldNotify = null;

    //     const updatedProjects = projects.map(project => {
    //         if (project.id !== projectId) return project;

    //         const currentIndex = project.project_stages.findIndex(
    //         s => s.status === project.current_status
    //         );

    //         const currentStage = project.project_stages[currentIndex];

    //         const docs = currentStage.requiredDocs
    //         const hasMissingDoc = docs.some(doc => doc.fileURL === "");

    //         if (!currentStage?.isCompleted) {
    //             shouldNotify = {
    //                 type: "error",
    //                 title: "Cannot proceed",
    //                 message: isHead
    //                 ? "Checklist items has not been completed"
    //                 : "Checklist items has not been completed"
    //             };

    //             return project;
    //         }

    //         if(hasMissingDoc) {
    //             shouldNotify = {
    //                 type: "error",
    //                 title: "Cannot proceed",
    //                 message: "Make sure all required documents are uploaded"
    //             };
    //         }

    //         // HEAD OF OPS FLOW
    //         if (isHead) {
    //             shouldNotify = {
    //                 type: "success",
    //                 title: "Successfully signed off a project status",
    //                 message: "Signoff successful. Project manager will be notified"
    //             };

    //             const nextIndex = currentIndex + 1;
    //             const nextStage = project.project_stages[nextIndex];

    //             if (!nextStage) return project;

    //             return {
    //                 ...project,
    //                 current_status: nextStage.status,
    //                 project_stages: project.project_stages.map((stage, idx) => {
    //                     if (idx !== nextIndex) return stage;

    //                     return {
    //                         ...stage,
    //                         isCompleted: false,
    //                         checklist: stage.checklist.map(item => ({
    //                             ...item,
    //                             checked: false
    //                         }))
    //                     };
    //                 })
    //             };
    //         }

    //         // PROJECT MANAGER FLOW
    //         if (isPM) {
    //             shouldNotify = {
    //                 type: "success",
    //                 title: "Request sent",
    //                 message: "Signoff has been requested. You will be notified when the status changes"
    //             };

    //             return project;
    //         }

    //         return project;
    //     });

    //     setProjects(updatedProjects);

    //     if (shouldNotify) {
    //         setNotification(shouldNotify);
    //     }
    // };

    return (
        <div className='relative'>
            {/* Stage Summary */}
            <div className='mb-3'>
                <div className='flex items-center justify-between rounded-lg border border-[#0000000D] p-4 bg-[#F3F3F3]'>
                    <div className='flex items-center gap-2'>
                        {/* Current Stage Info */}
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Stage {stageIndex}/8</p>
                        <p className='rounded-2xl px-2 py-1 bg-[#228CEE] font-medium text-[14px]/[20px] text-center text-[#FFFFFF]'>{currentStage}</p>
                    </div>
                    {/* Next Stage */}
                    <div>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Next- {nextStage}</p>
                    </div>
                </div>
            </div>

            {/* Stage Description */}
            <div className='flex flex-col'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>{title}</h3>
                <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>{desc}</p>

                {/* Number of Items */}
                <div className='flex items-center gap-2 mb-3'>
                    <div className='w-62.75 h-22 rounded-lg border border-[#0000000D] p-4 flex flex-col justify-between gap-4 bg-[#F3F3F3]'>
                        <p className='font-semibold text-[16px]/[20px] text-[#090909]'>{required}</p>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Mandatory Items</p>
                    </div>

                    <div className='w-62.75 h-22 rounded-lg border border-[#0000000D] p-4 flex flex-col justify-between gap-4 bg-[#F3F3F3]'>
                        <p className='font-semibold text-[16px]/[20px] text-[#090909]'>{}/{checklistLength}</p>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Completed</p>
                    </div>
                </div>
            </div>

            {/* Stage Checklist */}
            <div className='mb-3'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909] mb-3'>Stage Checklist</h3>
                {/* Checklist */}
                <div className='flex flex-col gap-2'>
                    {
                        projectStage.checklist.map((item, index) => (
                            <div 
                                key={item.id} 
                                onClick={() =>
                                    toggleChecklist(
                                        setProjects,
                                        selectedProject.id,
                                        projectStage.id,
                                        item.id,
                                        user
                                    )
                                }
                                className='flex items-center justify-between w-full h-21 rounded-lg border border-[#0000000D] p-4 bg-[#F3F3F3] cursor-pointer'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-3'>
                                        <input 
                                            type="checkbox" 
                                            checked={item.completed || false}
                                            readOnly
                                            name="" 
                                            id="" 
                                            className='w-5 h-5 rounded-md border border-[#D0D5DD] bg-[#FFFFFF] outline-none accent-[#7F56D9] pointer-events-none' 
                                            />
                                        <p className='font-medium text-[14px]/[20px] text-[#000000]'>{item.title}</p>
                                    </div>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>{item.desc}</p>
                                </div>
                                {/* Required? */}
                                <div className={`rounded-2xl px-2 py-1 text-center ${item.isRequired ? "bg-[#D20019]" : ""} font-medium text-[14px]/[20px] text-[#FFFFFF]`}>{item.isRequired && "Required"}</div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className=''>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909] mb-3'>Upload Supporting Documents</h3>
                {/* <ClientIDDoc /> */}
                {/* {projectStage.requiredDocs.map((doc, index) => (
                    <UploadBox 
                        key={index}
                        title={doc.key.title}
                        projects={projects}
                        selectedProject={selectedProject}
                        preview={preview}
                        setPreview={setPreview}
                    />
                ))} */}
                <button
                // onClick={() => handleNextStage(selectedProject.id)} 
                className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#1B3C4A] flex items-center justify-center gap-2 cursor-pointer'>
                    <i className="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                    <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>{user.role === "PROJECTMANAGER" ? "Request Signoff" : "Signoff"}</p>
                </button>
            </div>
        </div>
    )

}

export default ProjectLifeCycle