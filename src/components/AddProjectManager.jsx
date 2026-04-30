import React from 'react'
import { useState } from 'react'

function AddProjectManager({
    projects, 
    setProjects, 
    selectedProject, 
    setSelectedProject, 
    projectManagers, 
    assignedManager,
    setAssignedManager, 
    user,
    onClose}) {

    const [open, setOpen] = useState(false)
    const project = selectedProject


    const handleAssign = (projectId, p) => {
        if(user === "admin") {
            setProjects(prev => 
                prev.map(project =>
                    project.id === projectId
                        ? {...project, project_manager: p}
                        : project,
                        setAssignedManager(p),
                        onClose(),
                        setAssignedManager(null)
                )
            )
            alert('Your have successfully assigned a project manager')
        }
    };

    return (
        <div className='absolute z-2000 w-full h-full bg-[#00000080] flex flex-col items-end overflow-y-auto overscroll-contain'>
            <div className='flex flex-col w-135.5 h-430 overflow-y-auto overscroll-contain bg-[#F7F7F7] px-4 py-4'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='font-semibold text-[16px]/[20px] text-[#090909]'>Assign A Project Manager</h2>
                    <button
                    onClick={onClose}
                    className='px-4 py-2.5 rounded-lg border border-[#000000] bg-[#E8E8E8] flex items-center gap-2 cursor-pointer'>
                        <p className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Close</p>
                        <i className="fa-regular fa-circle-xmark fa-sm"></i>
                    </button>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="" className='font-medium text-[14px]/[20px] text-[#090909]'>Project</label>
                        <input 
                        type="text"
                        readOnly
                        value={project.project_name}
                        className='font-normal text-[16px]/[24px] text-[#667085] rounded-lg border border-[#D0D5DD] bg-[#EFEFEF] pt-2.5 pb-2.5 pl-3.5' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="" className='font-medium text-[14px]/[20px] text-[#090909]'>Client</label>
                        <input 
                        readOnly
                        type="text"
                        value={project.client}
                        className='font-normal text-[16px]/[24px] text-[#667085] rounded-lg border border-[#D0D5DD] bg-[#EFEFEF] pt-2.5 pb-2.5 pl-3.5' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="" className='font-medium text-[14px]/[20px] text-[#090909]'>Product</label>
                        <input 
                        readOnly
                        type="text"
                        value={project.product}
                        className='font-normal text-[16px]/[24px] text-[#667085] rounded-lg border border-[#D0D5DD] bg-[#EFEFEF] pt-2.5 pb-2.5 pl-3.5' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="" className='font-medium text-[14px]/[20px] text-[#090909]'>Sales ID</label>
                        <input 
                        type="text" 
                        readOnly
                        className='font-normal text-[16px]/[24px] text-[#667085] rounded-lg border border-[#D0D5DD] bg-[#EFEFEF] pt-2.5 pb-2.5 pl-3.5' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="" className='font-medium text-[14px]/[20px] text-[#090909]'>Client PMO Address</label>
                        <input 
                        type="text"
                        readOnly
                        className='font-normal text-[16px]/[24px] text-[#667085] rounded-lg border border-[#D0D5DD] bg-[#EFEFEF] pt-2.5 pb-2.5 pl-3.5' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="" className='font-medium text-[14px]/[20px] text-[#090909]'>PMO ID</label>
                        <input 
                        type="text" 
                        readOnly
                        className='font-normal text-[16px]/[24px] text-[#667085] rounded-lg border border-[#D0D5DD] bg-[#EFEFEF] pt-2.5 pb-2.5 pl-3.5' />
                    </div>
                    <div className='flex flex-col gap-1.5 sticky'>
                        <label htmlFor="" className='font-medium text-[14px]/[20px] text-[#090909]'> Assign Project Manager</label>
                        <button 
                            onClick={() => setOpen(!open)}
                            type="text" className='flex items-center justify-between rounded-lg border border-[#D0D5DD] bg-[#FFFFF] pt-2.5 pb-2.5 px-3.5 cursor-pointer'>
                                <p className='font-normal text-[16px]/[24px] text-[#667085]'>{assignedManager === null ? "Select A Project Manager" : assignedManager}</p>
                                <i className="fa-solid fa-chevron-down text-[#667085]"></i>
                        </button>
                        
                        {
                            open && (
                                <div className='flex flex-col items-start w-full h-35.75 rounded-lg -mt-1.5 overflow-y-auto overscroll-contain cursor-pointer'>
                                    {
                                        projectManagers.map((p, index) => (
                                            <button
                                            key={index}
                                            onClick={() => {
                                                setAssignedManager(p)
                                                setOpen(!open)
                                            }}
                                            className='font-medium text-[16px]/[24px] text-[#090909] pt-2.5 pb-2.5 pl-3.5  border border-[#D0D5DD] bg-[#EFEFEF] w-full text-left cursor-pointer'>{p}</button>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                    <button
                        onClick={() => handleAssign(project.id, assignedManager)}
                        className='w-full border border-[#0000000D] rounded-lg px-4 py-2.5 bg-[#1B3C4A] flex items-center justify-center gap-2 cursor-pointer'>
                            <i className="fa-regular fa-circle-check text-[#FFFFFF]"></i>
                            <p className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Assign Project Manager</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddProjectManager