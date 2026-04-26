import React from 'react'
import ClientIDDoc from './SupportingDocuments/ClientIDDoc';

function ProjectLifeCycle({ lifecycle, project }) {
    const status = project.Status
    const statusLifecycle = lifecycle.find(s => s.status === status);
    const totalStages = lifecycle.length
    const required = statusLifecycle.stages.filter(o => o.isRequired === true)
    const statusStages = statusLifecycle.stages.length

    return (
        <div className=''>
            {/* Stage Summary */}
            <div className='mb-3'>
                <div className='flex items-center justify-between rounded-lg border border-[#0000000D] p-4 bg-[#F3F3F3]'>
                    <div className='flex items-center gap-2'>
                        {/* Current Stage Info */}
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Stage 1/{totalStages}</p>
                        <p className='rounded-2xl px-2 py-1 bg-[#228CEE] font-medium text-[14px]/[20px] text-center text-[#FFFFFF]'>{statusLifecycle.status}</p>
                    </div>
                    {/* Next Stage */}
                    <div>
                        <p className='font-normal text-[16px]/[20px] text-[#636363]'>Next- {statusLifecycle["next-status"]}</p>
                    </div>
                </div>
            </div>

            {/* Stage Description */}
            <div className='flex flex-col'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>{statusLifecycle.title}</h3>
                <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>{statusLifecycle.desc}</p>
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
                        statusLifecycle.stages.map((stage, index) => (
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
                <ClientIDDoc />
                <button className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#1B3C4A] flex items-center justify-center gap-2'>
                    <i class="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                    <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Request Signoff</p>
                </button>
            </div>
        </div>
    )
}

export default ProjectLifeCycle