import React from 'react'
import { useState, useEffect } from 'react'
import SideBar from './SideBar'
import MainSection from './MainSection'
import ViewProjectsBody from '../projects/ViewProjectsBody'
import ProjectLifeCycle from '../projects/lifecycle/ProjectLifeCycle'
import AddProjectManager from '../projects/AddProjectManager'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import SetupProjectModal from '../projects/tasks/SetupProjectModal'

function MainBody({ user, setUser}) {

    const navigate = useNavigate()
    
    const handleLogout = async () => {

        try {

            // clear frontend storage-
            localStorage.clear()

            // reset state if needed
            setUser(null)

            // redirect to login
            navigate("/")

        } catch(error) {
            console.error("Logout failed:", error)
        }
    }

    const [activeTab, setActiveTab] = useState("dashboard")
    const [openProject, setOpenProject] = useState(false)
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
    const [activeSubTab, setActiveSubTab] = useState("overview")

    // const isSetupComplete = (selectedProject?.resources?.length ?? 0) > 0
    const [activeDetails, setActiveDetails] = useState("project_lifecycle")
    const [selectedProject, setSelectedProject] = useState(null)
    // const [showLifecycleModal, setShowLifecycleModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [checkedList, setCheckedList] = useState([])

    const [projects, setProjects] = useState([]);
    const [projectManagers, setProjectManagers] =  useState([])
    const [assignedManager, setAssignedManager] = useState("Select A Project Manager")
    const [isLoading, setisLoading] = useState(false)

    // selected project
    useEffect(() => {
        const idToMatch = selectedProject?.projectId || selectedProject?.id || selectedProject?._id;
        if (!idToMatch) return;

        const updated = projects.find(p => p.projectId === idToMatch || p.id === idToMatch || p._id === idToMatch);

        if (!updated) return;

        setSelectedProject(updated);
    }, [projects, selectedProject?.projectId, selectedProject?.id, selectedProject?._id]);


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

        if(user?.role === "HEADOFOPS") {
            loadProjectManagers();
        }

    }, []);

    return (
        <div className='relative flex max-w-360 h-screen bg-[#FFFFFF]'>

            <SideBar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                handleLogout={handleLogout}
                setOpenProject={setOpenProject}
            />

            <MainSection
                projects={projects}
                setProjects={setProjects}
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
            />

            {isSetupModalOpen && (
                <SetupProjectModal
                    project={selectedProject}
                    onClose={() => setIsSetupModalOpen(false)}
                    // onSetupComplete={onProjectUpdated}
                />
            )}

            {/* {selectedProject && activeSubTab === "project_lifecycle" && (
                <ViewProjectsBody
                    projects={projects}
                    setProjects={setProjects}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                    onClose={() => setSelectedProject(null)}
                    activeDetails={activeDetails}
                    setActiveDetails={setActiveDetails}
                    user={user}
                />
            )} */}

            {/* {selectedProject && user.role === "HEADOFOPS" && !selectedProject?.projectManager ? (
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
            ) : selectedProject ? (
                <ViewProjectsBody
                    projects={projects}
                    setProjects={setProjects}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                    selectedStage={selectedStage}
                    setSelectedStage={setSelectedStage}
                    onClose={() => setSelectedProject(null)}
                    activeDetails={activeDetails}
                    setActiveDetails={setActiveDetails}
                    user={user}
                />
            ) : null} */}
        </div>
    )
}

export default MainBody
