import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import MainSection from "./MainSection";
import AddProjectManager from "../projects/AddProjectManager";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function MainBody({ user, setUser }) {
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================== */
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeDetails, setActiveDetails] = useState("project_lifecycle");

  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  const [projectManagers, setProjectManagers] = useState([]);
  const [assignedManager, setAssignedManager] = useState("Select A Project Manager");

  const [isLoading, setIsLoading] = useState(true);

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* =========================
     FETCH PROJECTS (CLEAN)
  ========================== */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await api.get("/projects");

        const data = res.data?.data || res.data?.projects || [];

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  /* =========================
     FETCH PROJECT MANAGERS
  ========================== */
  useEffect(() => {
    const getProjectManagers = async () => {
      try {
        const res = await fetch("/mockProjects/projectManagers.json");

        if (!res.ok) throw new Error("Failed to fetch project managers");

        const data = await res.json();
        setProjectManagers(data);
      } catch (err) {
        console.error(err);
      }
    };

    getProjectManagers();
  }, []);

  /* =========================
     SYNC SELECTED PROJECT
  ========================== */
  useEffect(() => {
    if (!selectedProject?.id) return;

    const updated = projects.find((p) => p.id === selectedProject.id);

    if (updated) setSelectedProject(updated);
  }, [projects]);

  /* =========================
     LOADING STATE
  ========================== */
  if (isLoading) {
    return <p className="p-4 text-gray-500">Loading projects...</p>;
  }

  /* =========================
     ASSIGN PROJECT MANAGER VIEW LOGIC
  ========================== */
  const showAssignModal =
    selectedProject &&
    !selectedProject.projectManagerEmail &&
    user?.role === "HEADOFOPS";

  return (
    <div className="relative flex max-w-360 h-screen bg-white">

      {/* SIDEBAR */}
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* MAIN SECTION */}
      <MainSection
        projects={projects}
        activeTab={activeTab}
        setSelectedProject={setSelectedProject}
        user={user}
      />

      {/* =========================
          ASSIGN PROJECT MANAGER
      ========================== */}
      {showAssignModal && (
        <AddProjectManager
          projects={projects}
          setProjects={setProjects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          onClose={() => setSelectedProject(null)}
          projectManagers={projectManagers}
          assignedManager={assignedManager}
          setAssignedManager={setAssignedManager}
          user={user}
        />
      )}
    </div>
  );
}

export default MainBody;