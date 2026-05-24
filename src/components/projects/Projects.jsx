import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { FaEllipsisV } from 'react-icons/fa';

function Projects({ 
    projects, 
    currentProjects, 
    searchValue,
    setSearchValue,
    filterValue,
    setFilterValue,
    currentPage, 
    totalPages, 
    setCurrentPage, 
    itemsPerPage,
    setSelectedProject, 
    user,
    isLoading
    }) {

    const STAGES = {
        1: "Client ID",
        2: "Engagement",
        3: "Initiation",
        4: "Planning",
        5: "Execution",
        6: "UAT",
        7: "Go-Live",
        8: "Closure"
    };

    const setCurrentStage = (currentStage) => {
        return STAGES[currentStage] || "Unknown Stage";
    };

    if(isLoading) return <div className={`w-18 h-18 rounded-full border-8 border-[#636363] border-t-[#1B3C4A] absolute top-50 animate-spin`}></div>

    return (
        <div className='px-4 pt-4 flex flex-col h-screen'>
            <div className='cursor-pointer'>
                <span className='font-medium text-[14px]/[20px] text-[#949494]'>Dashboard</span> <span className='text-[#949494]'>/</span> <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Projects</span>
            </div>
            <div className='flex items-center justify-between gap-2 relative'>
                <div className='py-4'>
                    <h3 className='font-semibold text-[14px]/[20px] text-[#090909] mb-2'>Projects</h3>
                    <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>View all assigned projects</p>
                </div>

                <div className='w-102.25 h-10 flex items-center gap-3 relative'>
                    <div
                        className='w-72.25 border border-[#00000026] py-2.5 px-3 bg-[#FFFFFF] rounded-lg flex items-center gap-3'>
                        <i className="fa-solid fa-magnifying-glass text-[#090909]"></i>
                        <input 
                            type="text"
                            value={searchValue}
                            onInput={(e) => setSearchValue(e.target.value)} 
                            placeholder='Search projects...'
                            className='outline-none'
                        />
                    </div>

                    <div
                        className='w-30 rounded-lg border border-[#0000000D] bg-[#E8E8E8] text-[#1B3C4A] py-2.5 px-2 cursor-pointer font-semibold text-[13px]'>
                        <select
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className='outline-none'
                            name="" 
                            id="">
                            <option 
                                value="all">
                                    ALL
                            </option>
                            <option
                                value="open">
                                    OPEN
                            </option>
                            <option
                                value="submitted">
                                    SUBMITTED
                            </option>
                            <option 
                                value="approved">
                                    APPROVED
                            </option>
                            <option
                                value="completed">
                                    COMPLETED
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* projects table with details */}
            <section className='w-full min-h-0 overflow-y-auto no-scrollbar border-collapse rounded-lg border border-[#0000000D] relative'>
                <table className='w-360'>
                    <thead className='sticky top-0 z-2000 h-11'>
                        <tr className='text-left'>
                            <th className='w-25 py-3 px-6 bg-[#F9FAFB] font-semibold text-[12px]/[18px] text-[#090909] justify-center'>ID</th>
                            <th className='w-50 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>Project Name</th>
                            <th className='w-47 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>Client</th>
                            <th className='w-50 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>Product</th>
                            {
                                user?.role === "HEADOFOPS" && (
                                    <th className='w-50 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>PM</th>
                                )
                            }
                            <th className='w-30 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>Status</th>
                            <th className='w-30 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>Stage</th>
                            <th className='w-10 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'></th>
                        </tr>
                    </thead>

                    <tbody className=''>
                        {
                            currentProjects.map((project, index) => (
                                <tr key={index} className='border-y border-[#0000000D] cursor-pointer'>
                                    <td className='py-4 px-6 font-normal text-[14px]/[20px] text-[#636363] justify-center align-middle truncate'>{project.id}</td>
                                    <td title={project.projectName} className='py-4 px-6 font-normal text-[14px]/[20px] text-[#636363] justify-center align-middle truncate'>{project.projectName}</td>
                                    <td title={project.clientName} className='py-4 px-6 font-normal text-[14px]/[20px] text-[#636363] justify-center align-middle truncate'>{project.clientName}</td>
                                    <td title={project.productName} className='py-4 px-6 font-normal text-[14px]/[20px] text-[#636363] justify-center align-middle truncate'>{project.productName}</td>
                                    {
                                        user?.role === "HEADOFOPS" && (
                                            <td title={project.projectManagerEmail} className='py-4 px-6 font-normal text-[14px]/[20px] text-[#636363] justify-center align-middle'>{project.projectManagerEmail === null ? "Not Assigned" : project.projectManagerEmail}</td>
                                        )
                                    }
                                    <td className='py-4 px-6 font-normal text-[14px]/[20px] text-[#FFFFFF] align-middle'>
                                        <p className='rounded-2xl py-1 px-2 bg-[#228CEE] text-center'>{project?.workflowStatus}</p>
                                    </td>
                                    <td className='py-4 px-6 font-normal text-[14px]/[20px] text-[#FFFFFF] align-middle'>
                                        <p className='rounded-2xl py-1 px-2 bg-[#228CEE] text-center'>{setCurrentStage(project.currentStageOrder)}</p>
                                    </td>
                                    <td className='py-4 px-6 font-normal text-[14px]/[20px] text-[#636363] relative justify-center align-middle'>

                                        <FaEllipsisV 
                                            onClick={() => setSelectedProject(project)} 
                                            className="cursor-pointer text-[#98a2b3] hover:text-[#1B3C4A] " 
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>

            <div className='flex items-center justify-between w-full py-6'>
                <p className='font-medium text-[14px]/[20px] text-[#636363]'>Page {currentPage} of {totalPages}</p>
                <div className='flex items-center gap-2'>
                    <button onClick={() => setCurrentPage((p) => Math.max(p -1, 1))} className='rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF] cursor-pointer'>Previous</button>
                    <button onClick={() => 
                        setCurrentPage((p) => 
                            p < Math.ceil(projects.length / itemsPerPage)
                            ? p + 1
                            : p
                    )} className='rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF] cursor-pointer'>Next</button>
                </div>
            </div>
        </div>
    )
}

export default Projects
