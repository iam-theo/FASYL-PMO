import React, { useMemo, useState } from 'react'
import { ChevronDownIcon, PlusCircleIcon } from '../icons'
import CreateTaskModal from '../tasks/CreateTaskModal'
import DeleteTaskModal from '../tasks/DeleteTaskModal'
import { TASK_PRIORITY_OPTIONS, TASK_ASSIGNEES } from '../tasks/mockTasks'
import { DUE_DATE_FILTERS, matchesDueDateFilter } from '../tasks/dueDateFilters'
import KanbanColumn from './KanbanColumn'
import { STATUS_COLUMNS } from './kanbanConstants'

function KanbanTab({ tasks, setTasks }) {
    const [statusFilter, setStatusFilter] = useState("All Status")
    const [priorityFilter, setPriorityFilter] = useState("All Priorities")
    const [assigneeFilter, setAssigneeFilter] = useState("All Team Members")
    const [dueDateFilter, setDueDateFilter] = useState("Due Date")

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

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

    const tasksByStatus = useMemo(() => {
        const grouped = {}
        STATUS_COLUMNS.forEach((column) => {
            grouped[column.key] = filteredTasks.filter((task) => task.status === column.key)
        })
        return grouped
    }, [filteredTasks])

    const handleCreateTask = (newTask) => {
        setTasks((prev) => [{ id: `task-${Date.now()}`, ...newTask }, ...prev])
        setIsCreateModalOpen(false)
    }

    const handleConfirmDelete = () => {
        if (!deleteTarget) return
        setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id))
        setDeleteTarget(null)
    }

    const handleMove = (taskId, direction) => {
        setTasks((prev) =>
            prev.map((task) => {
                if (task.id !== taskId) return task
                const currentIndex = STATUS_COLUMNS.findIndex((c) => c.key === task.status)
                const nextIndex = currentIndex + direction
                if (nextIndex < 0 || nextIndex >= STATUS_COLUMNS.length) return task
                return { ...task, status: STATUS_COLUMNS[nextIndex].key }
            })
        )
    }

    const handleChangePriority = (taskId, priority) => {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, priority } : t)))
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
                        options={["All Status", ...STATUS_COLUMNS.map((c) => c.key)]}
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
            </div>

            <div className='flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-4'>
                {tasks.length === 0 ? (
                    <KanbanEmptyState onCreateTask={() => setIsCreateModalOpen(true)} />
                ) : (
                    <div className='flex items-start gap-3 h-full overflow-x-auto no-scrollbar'>
                        {STATUS_COLUMNS.map((column) => (
                            <KanbanColumn
                                key={column.key}
                                column={column}
                                tasks={tasksByStatus[column.key] ?? []}
                                onMove={handleMove}
                                onChangePriority={handleChangePriority}
                                onDelete={(task) => setDeleteTarget({ id: task.id })}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <CreateTaskModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateTask}
                />
            )}

            {deleteTarget && (
                <DeleteTaskModal
                    count={1}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
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

function KanbanEmptyState({ onCreateTask }) {
    return (
        <div className='flex items-center justify-center py-20 px-4'>
            <div className='w-88 flex flex-col items-center gap-6 text-center'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-15.5 h-15.5 rounded-lg border border-[#0000000D] bg-[#F3F3F3] flex items-center justify-center'>
                        <i className="fa-solid fa-table-columns fa-xl text-[#DBDBDB]"></i>
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

export default KanbanTab
