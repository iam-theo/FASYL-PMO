import React from "react";
import { useState, useEffect } from "react";
import { useOutlet } from "react-router-dom";
import SideBar from "./SideBar";
import MainSection from "./MainSection";
import ViewProjectsBody from "../projects/ViewProjectsBody";
import ProjectLifeCycle from "../projects/lifecycle/ProjectLifeCycle";
import AddProjectManager from "../projects/AddProjectManager";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api";
import SetupProjectModal from "../projects/tasks/SetupProjectModal";
import TopBar from "./TopBar";
import { REPORTS_BASE_PATH, resetReportsCache } from "../reports";

function MainBody({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      resetReportsCache();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  };
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openProject, setOpenProject] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const isSetupComplete = (selectedProject?.resources?.length ?? 0) > 0
  const [activeDetails, setActiveDetails] = useState("project_lifecycle");
  const [selectedProject, setSelectedProject] = useState(null);
  // const [showLifecycleModal, setShowLifecycleModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  const [projects, setProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [assignedManager, setAssignedManager] = useState(
    "Select A Project Manager",
  );
  const [isLoading, setisLoading] = useState(false);

  // selected project
  useEffect(() => {
    const idToMatch =
      selectedProject?.projectId || selectedProject?.id || selectedProject?._id;
    if (!idToMatch) return;

    const updated = projects.find(
      (p) =>
        p.projectId === idToMatch || p.id === idToMatch || p._id === idToMatch,
    );

    if (!updated) return;

    setSelectedProject(updated);
  }, [
    projects,
    selectedProject?.projectId,
    selectedProject?.id,
    selectedProject?._id,
  ]);

  //initial loading of projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const loadProjectManagers = async () => {
      try {
        const { data } = await api.get("/auth/project-managers");
        setProjectManagers(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProjects();

    if (user?.role === "HEADOFOPS") {
      loadProjectManagers();
    }
  }, []);

  // Non-null only when a child route (i.e. reports) matched.
  const outlet = useOutlet();
  const isReportsRoute = Boolean(outlet);

  // Landing directly on /app/reports must still light up the sidebar item.
  useEffect(() => {
    if (isReportsRoute) setActiveTab("reports");
  }, [isReportsRoute]);

  // The sidebar drives tabs by state, but reports is a real route — so this
  // translates a tab click into navigation and keeps the two in sync.
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "reports") navigate(REPORTS_BASE_PATH);
    else if (isReportsRoute) navigate("/app");
  };

  return (
    <div className="relative flex max-w-360 h-screen bg-[#FFFFFF]">
      <SideBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        handleLogout={handleLogout}
        setOpenProject={setOpenProject}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {selectedProject &&
        user.role === "HEADOFOPS" &&
        !selectedProject?.projectManager && (
          <AddProjectManager
            projects={projects}
            setProjects={setProjects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onClose={() => {
              setActiveTab("projects");
              setOpenProject(false);
              setSelectedProject(null);
            }}
            projectManagers={projectManagers}
            assignedManager={assignedManager}
            setAssignedManager={setAssignedManager}
            user={user}
          />
        )}

      {isReportsRoute ? (
        // Mirrors MainSection's shell exactly — the sidebar is `fixed`, so the
        // content column owns the offset and the header sits above a scrolling
        // region that starts below it.
        <div className="w-full lg:w-[80.55%] h-screen lg:ml-[19.44%] relative">
          <TopBar user={user} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="mt-18 h-[calc(100vh-4.5rem)] overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
              {outlet}
            </div>
          </main>
        </div>
      ) : (
        <MainSection
          projects={projects}
          setProjects={setProjects}
          projectManagers={projectManagers}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          setOpenProject={setOpenProject}
          openProject={openProject}
          isSetupModalOpen={isSetupModalOpen}
          setIsSetupModalOpen={setIsSetupModalOpen}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          user={user}
          isLoading={isLoading}
          activeDetails={activeDetails}
          setActiveDetails={setActiveDetails}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      {isSetupModalOpen && (
        <SetupProjectModal
          project={selectedProject}
          onClose={() => setIsSetupModalOpen(false)}
          // onSetupComplete={onProjectUpdated}
        />
      )}
    </div>
  );
}

export default MainBody;
