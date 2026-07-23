import React, { useState } from 'react'
import { CloseIcon, CheckCircleIcon, ChevronDownIcon, CalendarIcon } from '../icons/index'
import { TASK_ASSIGNEES, TASK_PRIORITY_OPTIONS } from './mockTasks'

function CreateTaskModal({ onClose, onCreate }) {
    const [title, setTitle] = useState("")
    const [assignedTo, setAssignedTo] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [priority, setPriority] = useState("Medium")

    const isValid = title.trim().length > 0

    const handleCreate = () => {
        if (!isValid) return

        onCreate({
            title: title.trim(),
            assignedTo: assignedTo || "Unassigned",
            description,
            startDate,
            dueDate,
            priority,
            status: "To-do",
        })
    }

    return (
        <div className='fixed inset-0 z-2000 w-full h-screen bg-[#00000080] flex items-stretch justify-end' onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className='relative z-3000 flex flex-col w-135.5 min-h-0 h-screen overflow-y-auto no-scrollbar bg-[#F7F7F7] px-4 py-4 gap-6'
            >
                <div className='flex items-center justify-between'>
                    <h2 className='font-semibold text-[16px]/[20px] text-[#090909]'>Create Task</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className='px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#E8E8E8] flex items-center gap-2 cursor-pointer'
                    >
                        <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Close</span>
                        <CloseIcon />
                    </button>
                </div>

                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='font-medium text-[14px]/[20px] text-[#090909]'>Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Enter Title'
                            className='rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] px-3.5 py-2.5 outline-none font-normal text-[16px]/[24px] text-[#090909] placeholder:text-[#667085]'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='font-medium text-[14px]/[20px] text-[#090909]'>Assign To</label>
                        <div className='relative rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                            <select
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className='w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg outline-none font-normal text-[16px]/[24px] text-[#667085] bg-transparent cursor-pointer'
                            >
                                <option value="">Select Resource</option>
                                {TASK_ASSIGNEES.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='font-medium text-[14px]/[20px] text-[#090909]'>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Enter description'
                            rows={6}
                            className='resize-none rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] px-3.5 py-2.5 outline-none font-normal text-[16px]/[24px] text-[#090909] placeholder:text-[#667085]'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='font-medium text-[14px]/[20px] text-[#090909]'>Start Date</label>
                        <div className='relative rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='w-full px-3.5 py-2.5 pr-10 rounded-lg outline-none font-normal text-[16px]/[24px] text-[#090909] bg-transparent'
                            />
                            <CalendarIcon className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='font-medium text-[14px]/[20px] text-[#090909]'>Due Date</label>
                        <div className='relative rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className='w-full px-3.5 py-2.5 pr-10 rounded-lg outline-none font-normal text-[16px]/[24px] text-[#090909] bg-transparent'
                            />
                            <CalendarIcon className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='font-medium text-[14px]/[20px] text-[#090909]'>Priority Rating</label>
                        <div className='relative rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className='w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg outline-none font-normal text-[16px]/[24px] text-[#667085] bg-transparent cursor-pointer'
                            >
                                {TASK_PRIORITY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2' />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={!isValid}
                    className='w-full rounded-lg border border-[#0000000D] bg-[#1B3C4A] px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    <CheckCircleIcon />
                    <span className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Create Task</span>
                </button>
            </div>
        </div>
    )
}

export default CreateTaskModal
