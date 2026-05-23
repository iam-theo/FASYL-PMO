import React from 'react'
import UploadBox from './UploadBox';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleChecklist } from './utils/ToggleChecklist';
import { submitStage, approveStage } from '../../../api';
import { useNotification } from '../../NotificationContext';

function ProjectLifeCycle({ 
    selectedProject, 
    setSelectedProject, 
    projects, 
    setProjects, 
    onClose,  
    user,
    }) {

        // console.log(projects)
        console.log(selectedProject)
        // console.log(user)

        const { setNotification } = useNotification()

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

    const setCurrentStage = (currentStageOrder) => {
        return STAGES[currentStageOrder] || "Unknown Stage";
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
    const currentStage = setCurrentStage(selectedProject.currentStageOrder);
    const stageName = setStageTitle(selectedProject.currentStageOrder)
    const projectStage = selectedProject.stages.find(s => s.stageName === stageName)
    // console.log(projectStage)
    const nextStage = setCurrentStage((selectedProject.currentStageOrder) + 1)
    const stageIndex = (selectedProject.currentStageOrder) - 1;
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


    const actionMap = {
        PROJECTMANAGER: submitStage,
        HEADOFOPS: approveStage,
    };

    const handleWorkflowAction = async () => {
        try {

            const action = actionMap[user.role];

            if (!action) {
                console.log("Unauthorized");
                return;
            }

            const response = await action(
                selectedProject.id,
                projectStage.stageOrder
            );

            user.role === "PROJECTMANAGER"
            ? setNotification({
                type: "success",
                title: "Signoff Request Sent!",
                message: `You have successfully sent a signoff request for - ${selectedProject.projectName} (${projectStage.stageName})`
            }) : setNotification({
                type: "success",
                title: "Project Stage Signed off Successful!",
                message: `You have successfully signed off for - ${selectedProject.projectName} (${projectStage.stageName})`
            });

            console.log(response);

        } catch (err) {
            console.error(err);

            setNotification({
                type: "error",
                title: "Signoff Request Failed!",
                message: err.message
            });
        }
    };


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
                {projectStage.requiredDocs.map((doc, index) => (
                    <UploadBox 
                        key={index}
                        title={doc.title}
                        docKey={doc.key}
                        docStatus={doc.status}
                        docName={doc.fileName}
                        docURL={doc.fileURL}
                        projectStage={projectStage}
                        selectedProject={selectedProject}
                        projectId={selectedProject.id}
                        stageId={projectStage.id}
                        doc={doc}
                    />
                ))}
                {user.role === "PROJECTMANAGER" && ( <button
                onClick={handleWorkflowAction} 
                className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#1B3C4A] flex items-center justify-center gap-2 cursor-pointer'>
                    <i className="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                    <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Request Signoff</p>
                </button>)}
                {user.role === "HEADOFOPS" && ( 
                    <div className='flex items-center justify-between gap-3'>
                        <button
                        onClick={handleWorkflowAction} 
                        className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#1B3C4A] flex items-center justify-center gap-2 cursor-pointer'>
                            <i className="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                            <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Accept Signoff</p>
                        </button>

                        <button
                        // onClick={handleWorkflowAction} 
                        className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#D20019] flex items-center justify-center gap-2 cursor-pointer'>
                            <i className="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                            <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Reject Signoff</p>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )

}

export default ProjectLifeCycle