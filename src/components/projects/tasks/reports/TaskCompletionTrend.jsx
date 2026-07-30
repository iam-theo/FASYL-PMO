const GRID_LINES_Y = [0, 41.25, 82.5, 123.75, 165]
const MONTH_LABELS = [
    { label: 'Jan', x: 8 },
    { label: 'Feb', x: 86 },
    { label: 'Mar', x: 164 },
    { label: 'Apr', x: 243 },
    { label: 'May', x: 319 },
    { label: 'Jun', x: 399 },
    { label: 'Jun', x: 478 },
]

function TaskCompletionTrend() {
    return (
        <div className='flex flex-col gap-4'>
            <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Task Completion Trend</h3>

            <div className='rounded-lg border border-[#0000000D] bg-white p-4'>
                <svg viewBox="0 0 508 195" className='w-full h-auto' xmlns="http://www.w3.org/2000/svg">
                    {GRID_LINES_Y.map((y) => (
                        <path key={y} d={`M17.5679 ${y}H508`} stroke="#01012E" strokeOpacity="0.08" />
                    ))}

                    {MONTH_LABELS.map(({ label, x }) => (
                        <text key={`${label}-${x}`} x={x} y="187" fill="#60646C" fontFamily="Inter" fontSize="12">
                            {label}
                        </text>
                    ))}

                    <path
                        d="M17.5679 69.0944C49.0917 38.4144 80.617 7.73438 112.141 7.73438C143.665 7.73438 175.19 22.8594 206.714 42.7974C238.238 62.7344 269.763 127.359 301.287 127.359C332.81 127.359 364.336 58.9534 395.86 57.2344C427.383 55.5164 458.909 55.0864 490.432 54.6564"
                        stroke="#2A9D90"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        d="M17.5679 123.75C49.0917 92.813 80.617 61.875 112.141 61.875C143.665 61.875 175.19 103.125 206.714 103.125C238.238 103.125 269.763 67.031 301.287 67.031C332.81 67.031 364.336 97.969 395.86 97.969C427.383 95.391 458.909 95.391 490.432 92.813"
                        stroke="#E76E50"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </div>
        </div>
    )
}

export default TaskCompletionTrend
