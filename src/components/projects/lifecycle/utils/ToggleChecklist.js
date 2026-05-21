 // checklist function for each project
export const toggleChecklist = (projectId, stageStatus, itemId) => {
    if(user.role === "PROJECTMANAGER") {
        setProjects(prev =>
            prev.map(project => {
                if (project.id !== projectId) return project;

                return {
                    ...project,
                    project_stages: project.project_stages.map(stage => {
                        if (stage.status !== stageStatus) return stage;

                        const updatedChecklist = stage.checklist.map(item =>
                            item.id === itemId
                            ? { ...item, checked: !item.checked }
                            : item
                        );

                        // check if ALL are checked
                        const allChecked = updatedChecklist.every(
                            item => item.checked
                        );

                        return {
                            ...stage,
                            checklist: updatedChecklist,
                            isCompleted: allChecked
                        };
                    })
                };
            })
        );
    } else return
};