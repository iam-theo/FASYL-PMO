import React from 'react'
import { useEffect, useState, useRef } from 'react'
import Dashboard from './Dashboard'
import Projects from './Projects'
import ViewProjectsBody from './ViewProjectsBody'

function MainSection({
    activeTab, 
    setSelectedProject, 
    projects, user }) {

    const [currentPage, setCurrentPage] = useState(1)

    
    const itemsPerPage = 10
    const totalPages = Math.ceil(projects.length / itemsPerPage)
    const startIndex = (currentPage -1) * itemsPerPage
    const currentProjects = projects.slice(
        startIndex, startIndex + itemsPerPage
    )

    return (
        <div className='w-[80.55%] h-screen ml-[19.44%] relative'>
            <header className='border-b-[1.5px] border-[#0000000D] p-4 flex items-center justify-between bg-[#FFFFFF] fixed w-[80.55%] h-18 z-1000'>
                <ul className='flex gap-2'>
                    <li className='w-43.5 h-10 flex justify-between rounded-md px-3 py-2 bg-[#EBEBEB]'>
                        <div className='w-21.5 flex items-center'>
                            <p>
                                <i className="fa-solid fa-bell fa-lg" style={{ "color": "#228cee" }}></i>
                            </p>
                            <p className='font-medium text-[14px]/[20px] text-[#636363] ml-2'>Notifications</p> 
                        </div> 
                        <p className='text-[#090909]'>0</p>
                    </li>
                    <li className='w-43.5 h-10 flex justify-between rounded-md px-3 py-2 bg-[#EBEBEB]'>
                        <div className='w-21.5 flex items-center'>
                            <p>
                                <i className="fa-solid fa-user-tag fa-lg" style={{ "color": "#d18a00" }}></i>
                            </p>
                            <p className='font-medium text-[14px]/[20px] text-[#636363] ml-2'>Tickets</p> 
                        </div>   
                        <p className='text-[#090909]'>0</p>
                        </li>
                </ul>
                <div className='flex gap-3'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#0000000D] font-medium text-[16px]/[24px] text-[#000000]'>FP</div>
                    <div>
                        <p className='font-medium text-[14px]/[20px] text-[#090909]'>Fasyl PMO</p>
                        <p className='font-normal text-[14px]/[20px] text-[#636363]'>PMO@fasylgroup.com</p>
                    </div>
                </div>
            </header>
            <section className='mt-18 h-full'>
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "projects" && (
                    <Projects
                        projects={projects} 
                        currentProjects={currentProjects} 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        setCurrentPage={setCurrentPage} 
                        itemsPerPage={itemsPerPage}
                        setSelectedProject={setSelectedProject}
                        user={user} 
                    />
                )}
            </section>
        </div>
    )
}

export default MainSection