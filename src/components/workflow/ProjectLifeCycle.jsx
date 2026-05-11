import React from "react";
import StageRenderer from "./core/StageRenderer";

function ProjectLifeCycle({
  selectedProject,
  user,
  toggleChecklist,
  notification,
  setNotification,
  preview,
  setPreview
}) {
  if (!selectedProject) return null;

  return (
    <div className="relative">
      <StageRenderer
        project={selectedProject}
        user={user}
        toggleChecklist={toggleChecklist}
        notification={notification}
        setNotification={setNotification}
        preview={preview}
        setPreview={setPreview}
      />
    </div>
  );
}

export default ProjectLifeCycle;