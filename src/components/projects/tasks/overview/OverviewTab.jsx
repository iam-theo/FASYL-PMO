import StatCard from './StatCard'
import OverviewCalendarSection from './OverviewCalendarSection'
import OverviewResourcesSection from './OverviewResourcesSection'
import OverviewActiveTasksSection from './OverviewActiveTasksSection'
import { TotalTasksIcon, OverdueTasksIcon, AssignedResourcesIcon } from './icons'
import { matchesDueDateFilter } from '../tasks/dueDateFilters'

function OverviewTab({ project, tasks, setTasks, onNavigateToTasks, onNavigateToResources }) {
    const resources = project?.resources ?? []

    const totalTasks = tasks.length
    const overdueTasks = tasks.filter((task) => matchesDueDateFilter(task.dueDate, "Overdue")).length
    const assignedResources = resources.length

    return (
        <div className='flex flex-col gap-6 px-4 py-4'>
            <div className='flex items-stretch gap-2 flex-wrap md:flex-nowrap'>
                <StatCard
                    value={totalTasks}
                    label="Total Tasks"
                    icon={<TotalTasksIcon />}
                    onSeeDetails={onNavigateToTasks}
                />
                <StatCard
                    value={overdueTasks}
                    label="Total Tasks Overdue"
                    icon={<OverdueTasksIcon />}
                    onSeeDetails={onNavigateToTasks}
                />
                <StatCard
                    value={assignedResources}
                    label="Assigned Resources"
                    icon={<AssignedResourcesIcon />}
                    onSeeDetails={onNavigateToResources}
                />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <OverviewCalendarSection tasks={tasks} />
                <OverviewResourcesSection resources={resources} />
            </div>

            <OverviewActiveTasksSection
                tasks={tasks}
                setTasks={setTasks}
                onSeeAll={onNavigateToTasks}
            />
        </div>
    )
}

export default OverviewTab
