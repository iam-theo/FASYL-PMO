import React from 'react'
import { useState, useEffect } from 'react'
import SideBar from './SideBar'
import MainSection from './MainSection'
import ViewProjectsBody from '../projects/ViewProjectsBody'
import ProjectLifeCycle from '../projects/lifecycle/ProjectLifeCycle'
import AddProjectManager from '../projects/AddProjectManager'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api'

function MainBody({ user, setUser}) {

    const navigate = useNavigate()
    
    const handleLogout = async () => {

        try {

            // clear frontend storage
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
    const [activeDetails, setActiveDetails] = useState("project_lifecycle")
    const [selectedProject, setSelectedProject] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [checkedList, setCheckedList] = useState([])

    const [projects, setProjects] = useState([]);
    const [projectManagers, setProjectManagers] =  useState(["sekemi@fasylng.com", "desmond@fasylng.com"])
    const [assignedManager, setAssignedManager] = useState("Select A Project Manager")
    const [isLoading, setisLoading] = useState(true)

    // selected project
    useEffect(() => {
        if (!selectedProject?.id) return;

        const updated = projects.find(p => p.id === selectedProject.id);

        if (!updated) return;

        setSelectedProject(updated);
    }, [projects]); // ONLY projects


    //initial loading of projects
    useEffect(() => {

        const loadProjects = async () => {
    
            if(projects.length > 0) {
                setisLoading(false)
                return
            }
    
            try {
                const { data } = await api.get("/projects")
                
                setProjects(data.data)

            } catch (err) {
                console.error(err);
            } finally {
                setisLoading(false)
            }
        }

        loadProjects();
        
    }, [])


    return (
        <div className='relative flex max-w-360 h-screen bg-[#FFFFFF]'>

            <SideBar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                handleLogout={handleLogout}
            />

            <MainSection
                projects={projects}
                activeTab={activeTab} 
                setSelectedProject={setSelectedProject}
                user={user}
                isLoading={isLoading}
            />

            {selectedProject && user.role === "HEADOFOPS" && !selectedProject?.projectManagerEmail ? (
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
                    onClose={() => setSelectedProject(null)}
                    activeDetails={activeDetails}
                    setActiveDetails={setActiveDetails}
                    user={user}
                />
            ) : null}
        </div>
    )
}

export default MainBody
