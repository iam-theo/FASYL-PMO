import React from 'react'
import ClientIDDoc from './SupportingDocuments/ClientIDDoc';
import UploadBox from './UploadBox';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectLifeCycle({ lifecycle, project }) {

    const status = project.current_status
    const currentStage = lifecycle.find(s => s.status === status);
    const totalStages = lifecycle.length
    const required = currentStage.checklist.filter(o => o.isRequired === true)
    const statusStages = currentStage.checklist.length
    const requiredDocs = currentStage.requiredDocs
    

    const [documents, setDocuments] = useState([])

    const handleFileUpload = (type, file) => {
        setDocuments((prev) => ({
            ...prev,
            [type]: file,
        }))
    }

    return (
        <div className=''>
            {/* Stage Summary */}
            <div className='mb-3'>
                <div className='flex items-center justify-between rounded-lg border border-[#0000000D] p-4 bg-[#F3F3F3]'>
                    <div className='flex items-center gap-2'>
                        {/* Current Stage Info */}
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Stage 1/{totalStages}</p>
                        <p className='rounded-2xl px-2 py-1 bg-[#228CEE] font-medium text-[14px]/[20px] text-center text-[#FFFFFF]'>{currentStage.status}</p>
                    </div>
                    {/* Next Stage */}
                    <div>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Next- {currentStage["next-status"]}</p>
                    </div>
                </div>
            </div>

            {/* Stage Description */}
            <div className='flex flex-col'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>{currentStage.title}</h3>
                <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>{currentStage.desc}</p>
                {/* Number of Items */}
                <div className='flex items-center gap-2 mb-3'>
                    <div className='w-62.75 h-22 rounded-lg border border-[#0000000D] p-4 flex flex-col justify-between gap-4 bg-[#F3F3F3]'>
                        <p className='font-semibold text-[16px]/[20px] text-[#090909]'>{required.length}</p>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Mandatory Items</p>
                    </div>

                    <div className='w-62.75 h-22 rounded-lg border border-[#0000000D] p-4 flex flex-col justify-between gap-4 bg-[#F3F3F3]'>
                        <p className='font-semibold text-[16px]/[20px] text-[#090909]'>0/{statusStages}</p>
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
                        currentStage.checklist.map((stage, index) => (
                            <div key={index} className='flex items-center justify-between w-full h-21 rounded-lg border border-[#0000000D] p-4 bg-[#F3F3F3]'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-3'>
                                        <input type="checkbox" name="" id="" className='w-5 h-5 rounded-md border border-[#D0D5DD] bg-[#FFFFFF] outline-none accent-[#7F56D9]' />
                                        <p className='font-medium text-[14px]/[20px] text-[#000000]'>{stage.title}</p>
                                    </div>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>{stage.desc}</p>
                                </div>
                                {/* Required? */}
                                <div className={`rounded-2xl px-2 py-1 text-center ${stage.isRequired ? "bg-[#D20019]" : ""} font-medium text-[14px]/[20px] text-[#FFFFFF]`}>{stage.isRequired && "Required"}</div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className=''>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909] mb-3'>Upload Supporting Documents</h3>
                {/* <ClientIDDoc /> */}
                {requiredDocs.map((doc) => (
                    <UploadBox 
                        key={project.id}
                        title={doc.fileName}
                        onFileSelect={(file) => handleFileUpload(doc.fileName, file)}
                        onPreview={() => openPreview(documents[doc.fileName])}
                        documents={documents}
                    />
                ))}
                <button className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#1B3C4A] flex items-center justify-center gap-2'>
                    <i className="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                    <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Request Signoff</p>
                </button>
            </div>
        </div>
    )
}

export default ProjectLifeCycle