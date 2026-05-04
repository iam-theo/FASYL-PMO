import React from 'react'
import { useState, useEffect } from 'react'
import SideBar from './SideBar'
import MainSection from './MainSection'
import ViewProjectsBody from './ViewProjectsBody'
import ProjectLifeCycle from './ProjectLifeCycle'
import AddProjectManager from './AddProjectManager'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function MainBody({ user, setUser}) {

    const navigate = useNavigate()
    
    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                {withCredentials: true}
            )

            // clear frontend storage
            localStorage.removeItem("token")
            localStorage.removeItem("user")

            // redirect to login
            navigate("/");
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
    
    // // save projects to localStorage
    // useEffect(() => {
    //     localStorage.setItem("projects", JSON.stringify(projects));
    // }, [projects]);


    // selected project
    useEffect(() => {
        if (!selectedProject?.id) return;

        const updated = projects.find(p => p.id === selectedProject.id);

        if (!updated) return;

        setSelectedProject(updated);
    }, [projects]); // ONLY projects


    // initial loading of projects
    useEffect(() => {
        const loadProjects = async () => {
    
            if(projects.length > 0) {
                setisLoading(false)
                return
            }
    
            try {

                const templateRes = await fetch("/mockProjects/stageTemplate.json")
                const templateData = await templateRes.json()

                setStageTemplate(templateData)

                const { data } = await axios.get("http://10.10.1.20.:9098/api/v1/integration/projects")
                
                const projectsData = await data.data

                const initializedProjects = projectsData.map(project => ({
                    ...project,
                    current_status: "Client ID",
                    project_manager: "",
                    project_stages: templateData.map(stage => ({
                        status: stage.status,
                        next_status: stage.next_status,
                        isCompleted: false,
                        title: stage.title,
                        requiredDocs: stage.requiredDocs,
                        checklist: stage.checklist.map(item => ({
                            id: item.id,
                            title: item.title,
                            desc: item.desc,
                            isRequired: item.isRequired
                        }))
                    }))
                }));

                setProjects(initializedProjects)
            } catch (err) {
                console.error(err);
            } finally {
                setisLoading(false)
            }
        }

        const getProjectManagers = async () => {
    
            try {
                const res = await fetch("/mockProjects/projectManagers.json")

                if(!res.ok) {
                    throw new Error("Failed to fetch data")
                }
        
                const data = await res.json()
                setProjectManagers(data)
            } catch (err) {
                console.error(err);
            }
        }
        loadProjects();
        getProjectManagers();
    }, [])
        
    if(isLoading) return <p>Loading...</p>


    // checklist function for each project
    const toggleChecklist = (projectId, stageStatus, itemId) => {
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
            />

            {/* {selectedProject && selectedProject?.project_manager !== "" && (
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

            {selectedProject && selectedProject?.project_manager === "" && user.role === "HEADOFOPS" && (
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
    )
}

export default MainBody