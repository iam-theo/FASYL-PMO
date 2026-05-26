import React from 'react'
import { useEffect, useState, useRef } from 'react'
import Dashboard from './Dashboard'
import Projects from '../projects/Projects'
import ViewProjectsBody from '../projects/ViewProjectsBody'
import { FaBell, FaUserTag } from 'react-icons/fa'

function MainSection({
    activeTab, 
    setActiveTab,
    selectedProject,
    setSelectedProject, 
    projects, 
    user,
    isLoading 
    }) {

    const [currentPage, setCurrentPage] = useState(1)
    const [value, setValue] = useState("")
    const [filter, setFilter] = useState("")
    const [searching, setSearching] = useState(false)
    const [filteringing, setFiltering] = useState(false)

    useEffect(() => {
        if (!value) return

        setSearching(true)

        const timer = setTimeout(() => {
            setSearching(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [value])

    const safeProjects = Array.isArray(projects) ? projects : []

    let filteredProjects = safeProjects.filter((project) => {
        if (user?.role === "HEADOFOPS") return true; // sees everything

        if (user?.role === "PROJECTMANAGER") {
            return project.projectManager?.email === user.email; 
            // only projects assigned
        }

        return false;
    });

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
        <div className='w-[80.55%] h-screen ml-[19.44%] relative'>

            {/* header */}
            <header className='border-b-[1.5px] border-[#0000000D] p-4 flex items-center justify-between bg-[#FFFFFF] fixed w-[80.55%] h-18 z-1000'>
                <ul className='flex gap-2'>
                    <li className='w-43.5 h-10 flex justify-between rounded-md px-3 py-2 bg-[#0000000D]'>
                        <div className='flex items-center'>
                            <FaBell className='text-[#7dbaf3] text-2xl rounded-full' />
                            <p className='font-medium text-[14px]/[20px] text-[#636363] ml-2'>Notifications</p> 
                        </div> 
                        <p className='text-[#090909]'>0</p>
                    </li>
                    <li className='w-43.5 h-10 flex justify-between rounded-md px-3 py-2 bg-[#0000000D]'>
                        <div className='flex items-center'>
                            <FaUserTag className='text-[#D18A00] text-2xl rounded-full' />
                            <p className='font-medium text-[14px]/[20px] text-[#636363] ml-2'>Tickets</p> 
                        </div>   
                        <p className='text-[#090909]'>0</p>
                        </li>
                </ul>
                <div className='flex gap-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#0000000D] font-medium text-[16px]/[24px] text-[#000000]'>{(user.fullName || "").split(" ").map(word => word[0]).join("")}</div>
                    <div>
                        <p className='font-medium text-[14px]/[20px] text-[#090909]'>{user.fullName}</p>
                        <p className='font-normal text-[14px]/[20px] text-[#636363]'>{user.email}</p>
                    </div>
                </div>
            </header>
            <section className='mt-18 h-full'>

                {activeTab === "dashboard" && (
                    <Dashboard
                        projects={projects}
                        user={user}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                    />
                )}

                {activeTab === "projects" && (
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
                    />
                )}
            </section>
        </div>
    )
}

export default MainSection
