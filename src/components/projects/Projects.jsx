import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { FaEllipsisV } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa6';

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
    isLoading,
    setOpenProject,
    setActiveSubTab
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

    // console.log(projects)

    const statusStyles = {
        UNASSIGNED: {
            bg: "#F2F4F7",
            text: "#344054",
        },

        OPEN: {
            bg: "#EFF8FF",
            text: "#228CEE",
        },

        SUBMITTED: {
            bg: "#FFF7ED",
            text: "#EA580C",
        },

        APPROVED: {
            bg: "#ECFDF3",
            text: "#027A48",
        },

        REJECTED: {
            bg: "#FEF3F2",
            text: "#D92D20",
        },

        COMPLETED: {
            bg: "#F0FDF4",
            text: "#15803D",
        },
    };

    const [openProjectMenu, setOpenProjectMenu] = useState(null);

    const setCurrentStage = (currentStage) => {
        return STAGES[currentStage] || "LOCKED";
    };

    if(isLoading) return <div className='w-full h-screen flex items-center justify-center'>
        <div className={`w-18 h-18 rounded-full border-8 border-[#636363] border-t-[#1B3C4A] absolute top-50 animate-spin`}></div>
    </div>

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
                                value="rejected">
                                    REJECTED
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
            <section className='w-full min-h-0 overflow-auto no-scrollbar rounded-lg border border-[#0000000D] relative'>
                <table className='min-w-300 border-collapse whitespace-nowrap'>
                    <thead className='sticky top-0 z-2000 h-11 bg-[#F9FAFB]'>
                        <tr className=''>
                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-left'>ID</th>
                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-left'>Project Name</th>
                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-left'>Client</th>
                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-left'>Product</th>
                            {
                                user?.role === "HEADOFOPS" && (
                                    <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-left'>PM</th>
                                )
                            }
                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-left'>Status</th>
                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-left'>Stage</th>
                            <th className='w-15 px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-center'></th>
                        </tr>
                    </thead>

                    <tbody className='h-11'>
                        {
                            currentProjects.map((project, index) => (
                                <tr 
                                    key={index} 
                                    className='border-y border-[#0000000D] cursor-pointer'
                                    onClick={() => {
                                        setOpenProject(true);
                                        setSelectedProject(project);
                                        setActiveSubTab("overview");
                                    }}>
                                    <td className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363] overflow-hidden whitespace-nowrap text-ellipsis'>{project.projectId}</td>
                                    <td title={project.projectName} className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363] overflow-hidden whitespace-nowrap text-ellipsis'>{project.projectName}</td>
                                    <td title={project.clientName} className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363] overflow-hidden whitespace-nowrap text-ellipsis'>{project.clientName}</td>
                                    <td title={project.productName} className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363] overflow-hidden whitespace-nowrap text-ellipsis'>{project.productName}</td>
                                    {
                                        user?.role === "HEADOFOPS" && (
                                            <td title={project.projectManager} className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363]'>{!project.projectManager?.email ? "Not Assigned" : project.projectManager?.email}</td>
                                        )
                                    }
                                    <td className='px-4 py-4 font-normal text-[14px]/[20px] text-[#FFFFFF] text-center'>
                                        <p
                                            className="rounded-full py-1"
                                            style={{
                                                backgroundColor: statusStyles[project?.workflowStatus]?.bg,
                                                color: statusStyles[project?.workflowStatus]?.text,
                                            }}
                                            >
                                            {project?.workflowStatus}
                                        </p>
                                    </td>
                                    <td className='px-4 py-4 font-normal text-[14px]/[20px] text-[#FFFFFF] text-center'>
                                        <p 
                                            className={`rounded-2xl p-1 ${setCurrentStage(project.currentStageOrder) !== "LOCKED" ? "bg-[#228CEE] text-[#FFFFFF]" : "bg-[#52525B] text-[#F4F4F5]"} text-center`}>
                                                {setCurrentStage(project.currentStageOrder)}
                                        </p>
                                    </td>
                                    {/* <td className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363] relative h-full'>

                                        <FaEllipsisV 
                                            onClick={() => {
                                                    if (project.projectManager === null) {
                                                        return setSelectedProject(project)
                                                    }

                                                    if (setCurrentStage(project.currentStageOrder) === "LOCKED") return;

                                                    setOpenProjectMenu(prev =>
                                                        prev === project.projectId
                                                            ? null
                                                            : project.projectId
                                                    )
                                                }
                                            } 
                                            className="cursor-pointer text-[#98a2b3] hover:text-[#1B3C4A]" 
                                        />

                                        {
                                            openProjectMenu === project.projectId && (
                                                <div
                                                    className='max-h-40 overflow-y-auto no-scrollbar absolute z-1000 w-40 right-5 border border-[#0000000D] bg-[#F9FAFB] rounded-lg text-[14px]/[20px]'>
                                                    <ul className=''>
                                                        {
                                                            project.stages.map(stage => (
                                                                <li
                                                                    key={stage.id}
                                                                    className='cursor-pointer flex items-center justify-between border-y border-[#0000000D] px-4 py-2'
                                                                    onClick={() => {

                                                                        if (stage.workflowStatus === "LOCKED") {
                                                                            return;
                                                                        }

                                                                        setSelectedProject(project);
                                                                        setOpenProjectMenu(null);

                                                                    }}
                                                                    >
                                                                    <p> {setCurrentStage(stage.stageOrder)}</p>
                                                                    
                                                                    <FaLock 
                                                                        className={`${stage.workflowStatus !== "LOCKED" ? "hidden" : "block"}`}
                                                                    />
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </td> */}
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
