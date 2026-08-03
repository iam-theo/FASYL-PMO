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
            if (project.projectId !== projectId) return project;

            return {
                ...project,
                stages: project.stages.map(stage => {
                    if (stage.id !== stageId) return stage;

                    const newChecklist = stage.checklist.map(item => {

                        // BLOCK REQUIRED ITEMS FROM MANUAL TOGGLE
                        if (item.id === itemId) {

                            if (item.isRequired) {
                                return item; // DO NOTHING
                            }

                            return {
                                ...item,
                                completed: !item.completed
                            };
                        }

                        return item;
                    });

                    updatedChecklist = newChecklist;

                    return {
                        ...stage,
                        checklist: newChecklist,

                        // optional + required combined
                        completed: newChecklist.every(i => i.completed)
                    };
                }),
            };
        })
    );

    await new Promise(r => setTimeout(r, 0));

    await handleChecklist(projectId, stageId, updatedChecklist);
};