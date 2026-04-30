import React from 'react'
import ClientIDDoc from './SupportingDocuments/ClientIDDoc';
import UploadBox from './UploadBox';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectLifeCycle({ 
    selectedProject, 
    setSelectedProject, 
    projects, 
    setProjects, 
    onClose, 
    toggleChecklist, 
    user }) {
    
    const projectStage = selectedProject.project_stages.find(s=> s.status === selectedProject.current_status)
    const nextStage = selectedProject.next_status
    const stageIndex = selectedProject.project_stages.findIndex(s => s. status === selectedProject.current_status) + 1;
    const length = selectedProject.project_stages.length
    const required = projectStage.checklist.filter(item => item.isRequired).length
    const completed = projectStage.checklist.filter(item => item.checked).length

    const handleNextStage = (projectId) => {
        if(user === "admin") {
            setProjects(prev =>
                prev.map(project => {
                    if (project.id !== projectId) return project;

                    const currentIndex = project.project_stages.findIndex(
                        s => s.status === project.current_status
                    );

                    const currentStage = project.project_stages[currentIndex];

                    if (!currentStage?.isCompleted) {
                        alert("Checklist items has not been completed.");
                        return project;
                    } else {
                        alert('Signoff sucessful. Project manager will be notified')
                    }

                    const nextIndex = currentIndex + 1;
                    const nextStage = project.project_stages[nextIndex];

                    if (!nextStage) return project;

                    return {
                        ...project,
                        current_status: nextStage.status,

                        // RESET CHECKLIST OF NEXT STAGE
                        project_stages: project.project_stages.map((stage, idx) => {
                            if (idx !== nextIndex) return stage;

                            return {
                                ...stage,
                                isCompleted: false,
                                checklist: stage.checklist.map(item => ({
                                ...item,
                                checked: false
                                }))
                            };
                        })
                    };
                })
            );
        }

        if(user === "user") {
            alert('Signoff has been requested. You will be notified when the status changes')
        }
    };

    return (
        <div>
            {/* Stage Summary */}
            <div className='mb-3'>
                <div className='flex items-center justify-between rounded-lg border border-[#0000000D] p-4 bg-[#F3F3F3]'>
                    <div className='flex items-center gap-2'>
                        {/* Current Stage Info */}
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Stage {stageIndex}/{length}</p>
                        <p className='rounded-2xl px-2 py-1 bg-[#228CEE] font-medium text-[14px]/[20px] text-center text-[#FFFFFF]'>{projectStage.status}</p>
                    </div>
                    {/* Next Stage */}
                    <div>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Next- {projectStage.next_status}</p>
                    </div>
                </div>
            </div>

            {/* Stage Description */}
            <div className='flex flex-col'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>{projectStage.title}</h3>
                <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>{projectStage.desc}</p>
                {/* Number of Items */}
                <div className='flex items-center gap-2 mb-3'>
                    <div className='w-62.75 h-22 rounded-lg border border-[#0000000D] p-4 flex flex-col justify-between gap-4 bg-[#F3F3F3]'>
                        <p className='font-semibold text-[16px]/[20px] text-[#090909]'>{required}</p>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Mandatory Items</p>
                    </div>

                    <div className='w-62.75 h-22 rounded-lg border border-[#0000000D] p-4 flex flex-col justify-between gap-4 bg-[#F3F3F3]'>
                        <p className='font-semibold text-[16px]/[20px] text-[#090909]'>{completed}/{length}</p>
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
                                onClick={() => toggleChecklist(selectedProject.id, projectStage.status, item.id)}
                            className='flex items-center justify-between w-full h-21 rounded-lg border border-[#0000000D] p-4 bg-[#F3F3F3] cursor-pointer'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-3'>
                                        <input 
                                        type="checkbox" 
                                        checked={item.checked}
                                        readOnly
                                        name="" 
                                        id="" 
                                        className='w-5 h-5 rounded-md border border-[#D0D5DD] bg-[#FFFFFF] outline-none accent-[#7F56D9]' />
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
                {projectStage.requiredDocs.map((doc,index) => (
                    <UploadBox 
                        key={index}
                        title={doc}
                        onFileSelect={(file) => handleFileUpload(doc, file)}
                        // onPreview={() => openPreview(documents[doc])}
                        // documents={documents}
                    />
                ))}
                <button
                onClick={() => handleNextStage(selectedProject.id)} 
                className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#1B3C4A] flex items-center justify-center gap-2 cursor-pointer'>
                    <i className="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                    <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>{user === "user" ? "Request Signoff" : "Signoff"}</p>
                </button>
            </div>
        </div>
    )

}

export default ProjectLifeCycle