import React from 'react'
import { useState, useEffect } from 'react'
import SideBar from '../SideBar'
import MainSection from '../MainSection'
import ViewProjectsBody from '../ViewProjectsBody'
import ProjectLifeCycle from '../ProjectLifeCycle'
import AddProjectManager from '../AddProjectManager'
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
    
    const [stageTemplate, setStageTemplate] = useState([])
    const [projectManagers, setProjectManagers] =  useState([])
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

                console.log(data)
                // setProjects(data.projects)

            } catch (err) {
                console.error(err);
            } finally {
                setisLoading(false)
            }
        }

        loadProjects();
        
    }, [])


    // // checklist function for each project
    // const toggleChecklist = (projectId, stageStatus, itemId) => {
    //     if(user.role === "PROJECTMANAGER") {
    //         setProjects(prev =>
    //             prev.map(project => {
    //                 if (project.id !== projectId) return project;

    //                 return {
    //                     ...project,
    //                     project_stages: project.project_stages.map(stage => {
    //                         if (stage.status !== stageStatus) return stage;

    //                         const updatedChecklist = stage.checklist.map(item =>
    //                             item.id === itemId
    //                             ? { ...item, checked: !item.checked }
    //                             : item
    //                         );

    //                         // check if ALL are checked
    //                         const allChecked = updatedChecklist.every(
    //                             item => item.checked
    //                         );

    //                         return {
    //                             ...stage,
    //                             checklist: updatedChecklist,
    //                             isCompleted: allChecked
    //                         };
    //                     })
    //                 };
    //             })
    //         );
    //     } else return
    // };


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

            {/* {selectedProject && (
                <ViewProjectsBody
                    projects={projects}
                    setProjects={setProjects}
                    stageTemplate={stageTemplate}
                    setStageTemplate={setStageTemplate}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject} 
                    onClose={() => setSelectedProject(null)}
                    activeDetails={activeDetails}
                    setActiveDetails={setActiveDetails}
                    checkedList={checkedList}
                    setCheckedList={setCheckedList}
                    toggleChecklist={toggleChecklist}
                    user={user}
                />
            )} */}

            {/* {selectedProject && selectedProject?.project_manager === "" && user.role === "HEADOFOPS" && (
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
            )} */}
        </div>
    )
}

export default MainBody