import React, { useMemo, useState } from 'react'
import { ChevronDownIcon, CheckboxCheckIcon, MoreVerticalIcon, TrashIcon, PlusCircleIcon } from '../icons'
import CreateTaskModal from './CreateTaskModal'
import DeleteTaskModal from './DeleteTaskModal'
import KanbanTab from '../kanban/KanbanTab'
import {
    TASK_STATUS_OPTIONS,
    TASK_PRIORITY_OPTIONS,
    TASK_ASSIGNEES,
    PRIORITY_BADGE_COLORS,
} from './mockTasks'
import { DUE_DATE_FILTERS, matchesDueDateFilter } from './dueDateFilters'

const ITEMS_PER_PAGE = 5

function TasksTab({ tasks, setTasks }) {
    const [view, setView] = useState('list')
    const [selectedIds, setSelectedIds] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [openMenuId, setOpenMenuId] = useState(null)

    const [statusFilter, setStatusFilter] = useState("All Status")
    const [priorityFilter, setPriorityFilter] = useState("All Priorities")
    const [assigneeFilter, setAssigneeFilter] = useState("All Team Members")
    const [dueDateFilter, setDueDateFilter] = useState("Due Date")

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null) // { ids: [...] } | null

    const assigneeOptions = useMemo(
        () => Array.from(new Set([...TASK_ASSIGNEES, ...tasks.map((t) => t.assignedTo)])),
        [tasks]
    )

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            if (statusFilter !== "All Status" && task.status !== statusFilter) return false
            if (priorityFilter !== "All Priorities" && task.priority !== priorityFilter) return false
            if (assigneeFilter !== "All Team Members" && task.assignedTo !== assigneeFilter) return false
            if (!matchesDueDateFilter(task.dueDate, dueDateFilter)) return false
            return true
        })
    }, [tasks, statusFilter, priorityFilter, assigneeFilter, dueDateFilter])

    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / ITEMS_PER_PAGE))

    const paginatedTasks = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredTasks.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredTasks, currentPage])

    const allOnPageSelected = paginatedTasks.length > 0 && paginatedTasks.every((t) => selectedIds.includes(t.id))

    const toggleSelectAllOnPage = () => {
        if (allOnPageSelected) {
            setSelectedIds((prev) => prev.filter((id) => !paginatedTasks.some((t) => t.id === id)))
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedTasks.map((t) => t.id)])))
        }
    }

    const toggleSelectTask = (taskId) => {
        setSelectedIds((prev) =>
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        )
    }

    const handleApplyChanges = () => {
        setSelectedIds([])
    }

    const handleStatusChange = (taskId, newStatus) => {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    }

    const handleCreateTask = (newTask) => {
        setTasks((prev) => [{ id: `task-${Date.now()}`, ...newTask }, ...prev])
        setIsCreateModalOpen(false)
        setCurrentPage(1)
    }

    const handleConfirmDelete = () => {
        if (!deleteTarget) return
        setTasks((prev) => prev.filter((t) => !deleteTarget.ids.includes(t.id)))
        setSelectedIds((prev) => prev.filter((id) => !deleteTarget.ids.includes(id)))
        setDeleteTarget(null)
        setOpenMenuId(null)
    }

    if (view === 'kanban') {
        return (
            <KanbanTab
                tasks={tasks}
                setTasks={setTasks}
                viewToggle={<ViewToggle view={view} onChange={setView} />}
            />
        )
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='px-4 pt-4 flex flex-col gap-4'>
                <div className='flex items-center justify-between gap-3 flex-wrap'>
                    <div className='flex-1 min-w-50 max-w-100 rounded-lg border border-[#0000001A] bg-[#FFFFFF] px-3.5 py-2.5 flex items-center gap-2'>
                        <i className="fa-solid fa-magnifying-glass text-[#090909]"></i>
                        <input
                            type="text"
                            placeholder='Search'
                            className='flex-1 outline-none font-normal text-[14px]/[24px] text-[#636363] bg-transparent'
                        />
                    </div>

                    <div className='flex items-center gap-3'>
                        <ViewToggle view={view} onChange={setView} />

                        <button
                            type="button"
                            className='px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#E8E8E8] flex items-center gap-2 cursor-pointer'
                        >
                            <i className="fa-solid fa-file-export text-[#090909]"></i>
                            <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Export</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className='px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#1B3C4A] flex items-center gap-2 cursor-pointer'
                        >
                            <PlusCircleIcon />
                            <span className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>New Task</span>
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    <FilterSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={["All Status", ...TASK_STATUS_OPTIONS]}
                    />
                    <FilterSelect
                        value={priorityFilter}
                        onChange={setPriorityFilter}
                        options={["All Priorities", ...TASK_PRIORITY_OPTIONS]}
                    />
                    <FilterSelect
                        value={assigneeFilter}
                        onChange={setAssigneeFilter}
                        options={["All Team Members", ...assigneeOptions]}
                    />
                    <FilterSelect
                        value={dueDateFilter}
                        onChange={setDueDateFilter}
                        options={DUE_DATE_FILTERS}
                    />
                </div>

                {selectedIds.length > 0 && (
                    <div className='rounded-lg border border-[#0000000D] bg-[#FFFFFF80] p-4 flex items-center justify-between flex-wrap gap-3'>
                        <p className='font-medium text-[12px]/[18px] text-[#090909]'>{selectedIds.length} Selected</p>
                        <div className='flex items-center gap-3 flex-wrap'>
                            <button
                                type="button"
                                disabled
                                className='px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#E8E8E8] flex items-center gap-2 cursor-not-allowed opacity-70'
                            >
                                <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Set Status</span>
                                <ChevronDownIcon />
                            </button>
                            <button
                                type="button"
                                disabled
                                className='px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#E8E8E8] flex items-center gap-2 cursor-not-allowed opacity-70'
                            >
                                <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Priority</span>
                                <ChevronDownIcon />
                            </button>
                            <button
                                type="button"
                                onClick={handleApplyChanges}
                                className='px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#1B3C4A] flex items-center gap-2 cursor-pointer'
                            >
                                <span className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Apply Changes</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteTarget({ ids: [...selectedIds] })}
                                className='h-10 px-4.5 rounded-lg border border-[#D92D20] bg-[#D92D20] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] flex items-center gap-2 cursor-pointer'
                            >
                                <TrashIcon />
                                <span className='font-medium text-[16px]/[24px] text-[#FFFFFF]'>Delete Selected</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-4'>
                {tasks.length === 0 ? (
                    <TasksEmptyState onCreateTask={() => setIsCreateModalOpen(true)} />
                ) : (
                    <div className='rounded-lg border border-[#0000000D] bg-[#F9FAFB] overflow-x-auto'>
                        <table className='w-full border-collapse min-w-175'>
                            <thead>
                                <tr className='border-b border-[#0000000D]'>
                                    <th className='w-16 px-6 py-4 text-left'>
                                        <TaskCheckbox checked={allOnPageSelected} onChange={toggleSelectAllOnPage} />
                                    </th>
                                    <th className='px-6 py-4 text-left font-medium text-[12px]/[18px] text-[#636363]'>Task</th>
                                    <th className='px-6 py-4 text-left font-medium text-[12px]/[18px] text-[#636363]'>Assigned To</th>
                                    <th className='px-6 py-4 text-left font-medium text-[12px]/[18px] text-[#636363]'>Priority</th>
                                    <th className='px-6 py-4 text-left font-medium text-[12px]/[18px] text-[#636363]'>Status</th>
                                    <th className='px-6 py-4 text-left font-medium text-[12px]/[18px] text-[#636363]'>Due Date</th>
                                    <th className='px-6 py-4 text-right font-medium text-[12px]/[18px] text-[#636363]'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTasks.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className='px-6 py-10 text-center font-normal text-[14px]/[20px] text-[#636363]'>
                                            No tasks match the selected filters.
                                        </td>
                                    </tr>
                                )}
                                {paginatedTasks.map((task) => (
                                    <tr key={task.id} className='border-b border-[#0000000D] last:border-b-0'>
                                        <td className='px-6 py-4'>
                                            <TaskCheckbox
                                                checked={selectedIds.includes(task.id)}
                                                onChange={() => toggleSelectTask(task.id)}
                                            />
                                        </td>
                                        <td className='px-6 py-4 font-medium text-[14px]/[20px] text-[#090909] whitespace-nowrap'>
                                            {task.title}
                                        </td>
                                        <td className='px-6 py-4 font-normal text-[14px]/[20px] text-[#636363] whitespace-nowrap'>
                                            {task.assignedTo}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span
                                                className='inline-flex items-center gap-1 rounded-2xl px-2 py-1 font-medium text-[14px]/[20px] text-[#FFFFFF]'
                                                style={{ backgroundColor: PRIORITY_BADGE_COLORS[task.priority] ?? "#949494" }}
                                            >
                                                {task.priority}
                                                <ChevronDownIcon stroke='white' />
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='relative w-36.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    className='w-full appearance-none px-3.5 py-2.5 pr-9 rounded-lg outline-none font-normal text-[16px]/[24px] text-[#667085] bg-transparent cursor-pointer'
                                                >
                                                    {TASK_STATUS_OPTIONS.map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                                <ChevronDownIcon className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2' />
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 font-normal text-[14px]/[20px] text-[#636363] whitespace-nowrap'>
                                            {task.dueDate}
                                        </td>
                                        <td className='px-6 py-4 text-right relative'>
                                            <button
                                                type="button"
                                                onClick={() => setOpenMenuId((prev) => (prev === task.id ? null : task.id))}
                                                className='w-5 h-5 inline-flex items-center justify-center cursor-pointer'
                                                aria-label="Task actions"
                                            >
                                                <MoreVerticalIcon stroke='#344054' />
                                            </button>
                                            {openMenuId === task.id && (
                                                <div className='absolute right-6 top-12 z-10 w-32 rounded-lg border border-[#0000000D] bg-[#FFFFFF] shadow-[0_4px_6px_-2px_rgba(16,24,40,0.03),0_12px_16px_-4px_rgba(16,24,40,0.08)] overflow-hidden'>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget({ ids: [task.id] })}
                                                        className='w-full px-4 py-2.5 text-left font-medium text-[14px]/[20px] text-[#D92D20] hover:bg-[#FEF3F2] cursor-pointer'
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {tasks.length > 0 && (
                <div className='border-t border-[#0000000D] bg-[#F2F2F2] px-6 py-4 flex items-center justify-between'>
                    <p className='font-medium text-[14px]/[20px] text-[#636363]'>Page {currentPage} of {totalPages}</p>
                    <div className='flex items-center gap-2'>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className='rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E8E8E8] disabled:hover:text-[#1B3C4A]'
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E8E8E8] disabled:hover:text-[#1B3C4A]'
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <CreateTaskModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateTask}
                />
            )}

            {deleteTarget && (
                <DeleteTaskModal
                    count={deleteTarget.ids.length}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    )
}

function TaskCheckbox({ checked, onChange }) {
    return (
        <button
            type="button"
            onClick={onChange}
            aria-pressed={checked}
            className={`w-5 h-5 flex items-center justify-center rounded-md border cursor-pointer ${
                checked ? "border-[#7F56D9] bg-[#F9F5FF]" : "border-[#D0D5DD] bg-[#FFFFFF]"
            }`}
        >
            {checked && <CheckboxCheckIcon />}
        </button>
    )
}

function FilterSelect({ value, onChange, options }) {
    return (
        <div className='relative rounded-lg border border-[#0000000D] bg-[#E8E8E8]'>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='w-full appearance-none px-4 py-2.5 pr-10 rounded-lg outline-none font-medium text-[14px]/[20px] text-[#1B3C4A] bg-transparent cursor-pointer'
            >
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <ChevronDownIcon className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2' />
        </div>
    )
}

function TasksEmptyState({ onCreateTask }) {
    return (
        <div className='flex items-center justify-center py-20 px-4'>
            <div className='w-88 flex flex-col items-center gap-6 text-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-15.5 h-15.5 rounded-lg border border-[#0000000D] bg-[#F3F3F3] flex items-center justify-center'>
                        <i className="fa-solid fa-list-check fa-xl text-[#DBDBDB]"></i>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                        <h3 className='font-medium text-[16px]/[24px] text-[#090909]'>You have not created any tasks</h3>
                        <p className='font-normal text-[14px]/[20px] text-[#636363]'>Click the buttton below to create a new task.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onCreateTask}
                    className='w-full rounded-lg border border-[#0000000D] bg-[#1B3C4A] px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer'
                >
                    <PlusCircleIcon />
                    <span className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Create Task</span>
                </button>
            </div>
        </div>
    )
}

function ListViewIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.60059 4.1665H17.6006" stroke="black" strokeWidth="1.25" strokeLinecap="round" />
            <path d="M7.60059 10H17.6006" stroke="black" strokeWidth="1.25" strokeLinecap="round" />
            <path d="M7.60059 15.8335H17.6006" stroke="black" strokeWidth="1.25" strokeLinecap="round" />
            <path d="M2.70508 4.16683H2.60091M2.80924 4.16683C2.80924 4.28189 2.71597 4.37516 2.60091 4.37516C2.48585 4.37516 2.39258 4.28189 2.39258 4.16683C2.39258 4.05177 2.48585 3.9585 2.60091 3.9585C2.71597 3.9585 2.80924 4.05177 2.80924 4.16683Z" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.70508 9.99984H2.60091M2.80924 9.99984C2.80924 10.1149 2.71597 10.2082 2.60091 10.2082C2.48585 10.2082 2.39258 10.1149 2.39258 9.99984C2.39258 9.88475 2.48585 9.7915 2.60091 9.7915C2.71597 9.7915 2.80924 9.88475 2.80924 9.99984Z" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.70508 15.8333H2.60091M2.80924 15.8333C2.80924 15.9484 2.71597 16.0417 2.60091 16.0417C2.48585 16.0417 2.39258 15.9484 2.39258 15.8333C2.39258 15.7182 2.48585 15.625 2.60091 15.625C2.71597 15.625 2.80924 15.7182 2.80924 15.8333Z" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function KanbanViewIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.757 3.24286C17.9163 4.40224 17.9163 6.26821 17.9163 10.0002C17.9163 13.7321 17.9163 15.5981 16.757 16.7575C15.5976 17.9168 13.7316 17.9168 9.99967 17.9168C6.26772 17.9168 4.40175 17.9168 3.24237 16.7575C2.08301 15.5981 2.08301 13.7321 2.08301 10.0002C2.08301 6.26821 2.08301 4.40224 3.24237 3.24286C4.40175 2.0835 6.26772 2.0835 9.99967 2.0835C13.7316 2.0835 15.5976 2.0835 16.757 3.24286Z" fill="#C6C6C6" fillOpacity="0.8" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.08301 2.0835V17.9168" stroke="black" strokeWidth="1.25" />
            <path d="M12.917 2.0835V17.9168" stroke="black" strokeWidth="1.25" />
        </svg>
    )
}

function ViewToggle({ view, onChange }) {
    return (
        <div className='flex h-10 items-center gap-2 rounded-lg border border-[#0000000D] bg-[#FFFFFF] px-2 py-3'>
            <button
                type="button"
                onClick={() => onChange('list')}
                className={`flex items-center justify-center gap-2 rounded px-2 py-2.5 h-6.5 cursor-pointer ${
                    view === 'list' ? 'border border-[#0000000D] bg-[#E8E8E8]' : ''
                }`}
            >
                <ListViewIcon />
                <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>List</span>
            </button>
            <button
                type="button"
                onClick={() => onChange('kanban')}
                className={`flex items-center justify-center gap-2 rounded px-2 py-3 h-5 cursor-pointer ${
                    view === 'kanban' ? 'border border-[#0000000D] bg-[#E8E8E8]' : ''
                }`}
            >
                <KanbanViewIcon />
                <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Kanban</span>
            </button>
        </div>
    )
}

export default TasksTab
