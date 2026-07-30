import ReportStatCards from './ReportStatCards'
import LifecycleTracker from './LifecycleTracker'
import DonutChart from './DonutChart'
import TaskCompletionTrend from './TaskCompletionTrend'
import UpcomingTaskReminder from './UpcomingTaskReminder'

const TASK_STATUS_ITEMS = [
    { label: 'Completed', color: '#34C759', count: 42, percent: 62 },
    { label: 'In Progress', color: '#08F', count: 12, percent: 21 },
    { label: 'Pending', color: '#FF8D28', count: 10, percent: 12 },
    { label: 'Overdue', color: '#FF383C', count: 10, percent: 6 },
]

const RESOURCE_ALLOCATION_ITEMS = [
    { label: 'Project Manager', color: '#34C759', count: 42, percent: 62 },
    { label: 'Developers', color: '#08F', count: 12, percent: 21 },
    { label: 'Designer', color: '#FF8D28', count: 10, percent: 12 },
    { label: 'Others', color: '#FF383C', count: 10, percent: 6 },
]

function ReportsTab() {
    return (
        <div className='flex flex-col gap-6 px-4 py-4'>
            <ReportStatCards />

            <LifecycleTracker />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <DonutChart title="Task Status Overview" items={TASK_STATUS_ITEMS} />
                <TaskCompletionTrend />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <UpcomingTaskReminder />
                <DonutChart title="Resource Allocation" items={RESOURCE_ALLOCATION_ITEMS} />
            </div>
        </div>
    )
}

export default ReportsTab
