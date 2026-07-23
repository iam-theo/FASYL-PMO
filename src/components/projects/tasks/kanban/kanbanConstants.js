export const STATUS_COLUMNS = [
    { key: "To-do", label: "To-Do" },
    { key: "In Progress", label: "In Progress" },
    { key: "In Review", label: "In Review" },
    { key: "Done", label: "Done" },
]

export function formatDueDate(dueDate) {
    if (!dueDate) return "--"
    const date = new Date(dueDate)
    if (Number.isNaN(date.getTime())) return dueDate
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}
