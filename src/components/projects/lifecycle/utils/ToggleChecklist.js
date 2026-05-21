// import { handleChecklist } from "./handleChecklist";
import { handleChecklist } from "../../../../api";

export const toggleChecklist = async (
    setProjects,
    projectId,
    stageId,
    itemId,
    user
    ) => {
    if (user.role !== "PROJECTMANAGER") return;

    let updatedChecklist = null;

    setProjects(prev =>
        prev.map(project => {
        if (project.id !== projectId) return project;

        return {
            ...project,
            stages: project.stages.map(stage => {
            if (stage.id !== stageId) return stage;

            const newChecklist = stage.checklist.map(item =>
                item.id === itemId
                ? { ...item, completed: !item.completed }
                : item
            );

            updatedChecklist = newChecklist;

            return {
                ...stage,
                checklist: newChecklist,
                completed: newChecklist.every(i => i.completed),
            };
            }),
        };
        })
    );

    // ⛔ IMPORTANT: wait a tick so state updates settle
    await new Promise(r => setTimeout(r, 0));

    // 🚀 NOW send correct data
    await handleChecklist(projectId, stageId, updatedChecklist);
};