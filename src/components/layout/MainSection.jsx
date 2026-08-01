import { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import Projects from '../projects/Projects'
import ProjectWorkspace from '../projects/tasks/ProjectWorkspace'
import TopBar from './TopBar'

function MainSection({
    activeTab, 
    setActiveTab,
    selectedProject,
    setSelectedProject,
    projects, 
    setProjects,
    projectManagers,
    user,
    isLoading,
    setOpenProject,
    openProject,
    isSetupModalOpen,
    setIsSetupModalOpen,
    isSetupComplete,
    activeSubTab,
    setActiveSubTab,
    activeDetails,
    setActiveDetails,
    setIsSidebarOpen
    }) {

    const [currentPage, setCurrentPage] = useState(1)
    const [value, setValue] = useState("")
    const [filter, setFilter] = useState("")
    const [searching, setSearching] = useState(false)
    const [filteringing, setFiltering] = useState(false)
    // const [openProject, setOpenProject] = useState(false)
    // const [activeSubTab, setActiveSubTab] = useState("overview")

    useEffect(() => {
        if (!value) return

        setSearching(true)

        const timer = setTimeout(() => {
            setSearching(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [value])

    const safeProjects = Array.isArray(projects) ? projects : []

    // console.log(safeProjects);

    let filteredProjects = safeProjects.filter((project) => {
        if (user?.role === "HEADOFOPS") return true; // sees everything

        if (user?.role === "PROJECTMANAGER") {
            return project.projectManager?.email === user.email; 
            // only projects assigned
        }

        return false;
    });

    // console.log(filteredProjects);

    if (value) {
        filteredProjects = filteredProjects.filter((project) => project.projectName.toLowerCase().includes(value.toLowerCase()))
    }

    if (filter && filter !== "all") {
        filteredProjects = filteredProjects.filter((project) => 
            project.workflowStatus.toLowerCase() === filter.toLowerCase()
        )
    }

    
    const itemsPerPage = 10
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentProjects = filteredProjects.slice(
        startIndex, startIndex + itemsPerPage
    )

    return (
        <div className='w-full lg:w-[80.55%] h-screen lg:ml-[19.44%] relative'>

            <TopBar user={user} setIsSidebarOpen={setIsSidebarOpen} />

            <section className='mt-18 h-full'>

                {activeTab === "dashboard" && openProject === false && (
                    <Dashboard
                        projects={projects}
                        user={user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                        setOpenProject={setOpenProject}
                        setActiveSubTab={setActiveSubTab}
                    />
                )}

                {activeTab === "projects" && openProject === false && (
                    <Projects
                        projects={projects} 
                        currentProjects={currentProjects}
                        searchValue={value}
                        setSearchValue={setValue} 
                        filterValue={filter}
                        setFilterValue={setFilter} 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        setCurrentPage={setCurrentPage} 
                        itemsPerPage={itemsPerPage}
                        setSelectedProject={setSelectedProject}
                        user={user} 
                        isLoading={isLoading}
                        setOpenProject={setOpenProject}
                        setActiveSubTab={setActiveSubTab}
                    />
                )}

                {openProject === true && selectedProject?.projectManager && (
                    <ProjectWorkspace 
                        project={selectedProject}
                        setProject={setSelectedProject}
                        projects={projects}
                        setProjects={setProjects}
                        projectManagers={projectManagers}
                        user={user}
                        setIsSetupModalOpen={setIsSetupModalOpen}
                        activeSubTab={activeSubTab}
                        setActiveSubTab={setActiveSubTab}
                        activeDetails={activeDetails}
                        setActiveDetails={setActiveDetails}
                        onNavigateToDashboard={() => {
                            setActiveTab("dashboard");
                            setOpenProject(false);
                        }}
                        onNavigateToProjects={() => {
                            setActiveTab("projects");
                            setOpenProject(false);
                        }}
                    />
                )}
            </section>
        </div>
    )
}

export default MainSection
