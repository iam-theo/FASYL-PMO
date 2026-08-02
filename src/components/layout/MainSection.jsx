import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Dashboard from './Dashboard'
import Projects from '../projects/Projects'
import ProjectWorkspace from '../projects/tasks/ProjectWorkspace'
import { FaBars } from 'react-icons/fa'

function NotificationsIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.52992 14.394C2.31727 15.7471 3.268 16.6862 4.43205 17.1542C8.89481 18.9486 15.1052 18.9486 19.5679 17.1542C20.732 16.6862 21.6827 15.7471 21.4701 14.394C21.3394 13.5625 20.6932 12.8701 20.2144 12.194C19.5873 11.2975 19.525 10.3197 19.5249 9.27941C19.5249 5.2591 16.1559 2 12 2C7.84413 2 4.47513 5.2591 4.47513 9.27941C4.47503 10.3197 4.41272 11.2975 3.78561 12.194C3.30684 12.8701 2.66061 13.5625 2.52992 14.394Z" fill="#228CEE" fillOpacity="0.3" stroke="#228CEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21C9.79613 21.6219 10.8475 22 12 22C13.1525 22 14.2039 21.6219 15 21" stroke="#228CEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function TicketsIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.9961 9.01264H17.0042M17.0045 7.00903V4.50451M22 6.792C22 9.43833 19.7593 11.584 16.9961 11.584C16.6711 11.5844 16.3472 11.5543 16.028 11.4943C15.7983 11.4511 15.6835 11.4296 15.6033 11.4418C15.523 11.454 15.4094 11.5145 15.1822 11.6356C14.5393 11.9778 13.7896 12.0987 13.0686 11.9645C13.3426 11.627 13.5298 11.2222 13.6123 10.7882C13.6624 10.5228 13.5384 10.2649 13.3526 10.0762C12.5093 9.21878 11.9922 8.06347 11.9922 6.792C11.9922 4.14565 14.2328 2 16.9961 2C19.7593 2 22 4.14565 22 6.792Z" stroke="#D18A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.50189 22H4.71817C4.39488 22 4.07021 21.9545 3.77327 21.8269C2.80666 21.4116 2.31624 20.8633 2.08769 20.5202C1.95764 20.325 1.97617 20.0764 2.11726 19.889C3.23716 18.4015 5.8337 17.503 7.50189 17.5029M7.50665 22H10.2904C10.6137 22 10.9383 21.9545 11.2353 21.8269C12.2019 21.4116 12.6923 20.8633 12.9209 20.5202C13.0509 20.325 13.0324 20.0764 12.8913 19.889C11.7714 18.4015 9.17484 17.503 7.50665 17.5029M10.2854 12.2888C10.2854 13.8201 9.0413 15.0614 7.50665 15.0614C5.97199 15.0614 4.72791 13.8201 4.72791 12.2888C4.72791 10.7575 5.97199 9.51611 7.50665 9.51611C9.0413 9.51611 10.2854 10.7575 10.2854 12.2888Z" fill="#D18A00" fillOpacity="0.3" stroke="#D18A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

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

    const location = useLocation()
    const isReportsRoute = location.pathname.startsWith('/app/reports')

    const [currentPage, setCurrentPage] = useState(1)
    const [value, setValue] = useState("")
    const [filter, setFilter] = useState("")
    const [searching, setSearching] = useState(false)
    const [filteringing, setFiltering] = useState(false)
    // const [openProject, setOpenProject] = useState(false)
    // const [activeSubTab, setActiveSubTab] = useState("overview")

    useEffect(() => {
        if (isReportsRoute) {
            setActiveTab("reports")
        }
    }, [isReportsRoute, setActiveTab])

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

            {/* header */}
            <header className='border-b-[1.5px] border-[#0000000D] p-4 flex items-center justify-between gap-2 bg-[#FFFFFF] fixed w-full lg:w-[80.55%] h-18 z-1000'>
                <div className='flex items-center gap-2 min-w-0'>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className='lg:hidden shrink-0 w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#0000000D] cursor-pointer'>
                        <FaBars className='text-lg text-[#1B3C4A]' />
                    </button>
                    <ul className='flex gap-2 overflow-x-auto no-scrollbar'>
                        <li className='shrink-0 h-10 flex items-center justify-between gap-2 rounded-md px-3 py-2 bg-[#0000000D]'>
                            <div className='flex items-center gap-2'>
                                <NotificationsIcon />
                                <p className='hidden sm:block font-medium text-[14px]/[20px] text-[#636363] whitespace-nowrap'>Notifications</p>
                            </div>
                            <p className='text-[#090909]'>0</p>
                        </li>
                        {/* <li className='shrink-0 h-10 flex items-center justify-between gap-2 rounded-md px-3 py-2 bg-[#0000000D]'>
                            <div className='flex items-center gap-2'>
                                <TicketsIcon />
                                <p className='hidden sm:block font-medium text-[14px]/[20px] text-[#636363] whitespace-nowrap'>Tickets</p>
                            </div>
                            <p className='text-[#090909]'>0</p>
                        </li> */}
                    </ul>
                </div>
                <div className='flex gap-3 shrink-0'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#0000000D] font-medium text-[16px]/[24px] text-[#000000] shrink-0'>{(user.fullName || "").split(" ").map(word => word[0]).join("")}</div>
                    <div className='hidden sm:block'>
                        <p className='font-medium text-[14px]/[20px] text-[#090909]'>{user.fullName}</p>
                        <p className='font-normal text-[14px]/[20px] text-[#636363]'>{user.email}</p>
                    </div>
                </div>
            </header>
            <section className='mt-18 h-[calc(100%-4.5rem)]'>

                {!isReportsRoute && activeTab === "dashboard" && openProject === false && (
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

                {!isReportsRoute && activeTab === "projects" && openProject === false && (
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

                {!isReportsRoute && openProject === true && selectedProject?.projectManager && (
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

                {isReportsRoute && (
                    <div className='h-full min-w-0 overflow-y-auto overflow-x-hidden no-scrollbar'>
                        <Outlet />
                    </div>
                )}
            </section>
        </div>
    )
}

export default MainSection
