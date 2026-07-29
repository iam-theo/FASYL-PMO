// import React from 'react'
// import bgSignInTwo from "../../assets/bgSignInTwo.jpg"
import { FaEllipsisV } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa6';
import { useState } from 'react'

function ChevronIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.50004 5C7.50004 5 12.5 8.68242 12.5 10C12.5 11.3177 7.5 15 7.5 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function UsersStatIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.6161 20H19.1063C20.2561 20 21.1707 19.4761 21.9919 18.7436C24.078 16.8826 19.1741 15 17.5 15M15.5 5.06877C15.7271 5.02373 15.9629 5 16.2048 5C18.0247 5 19.5 6.34315 19.5 8C19.5 9.65685 18.0247 11 16.2048 11C15.9629 11 15.7271 10.9763 15.5 10.9312" stroke="#CB0ACF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4.48131 16.1112C3.30234 16.743 0.211139 18.0331 2.09388 19.6474C3.01359 20.436 4.03791 21 5.32572 21H12.6743C13.9621 21 14.9864 20.436 15.9061 19.6474C17.7889 18.0331 14.6977 16.743 13.5187 16.1112C10.754 14.6296 7.24599 14.6296 4.48131 16.1112Z" fill="#CB0ACF" fillOpacity="0.3" stroke="#CB0ACF" strokeWidth="1.5" />
            <path d="M13 7.5C13 9.70914 11.2091 11.5 9 11.5C6.79086 11.5 5 9.70914 5 7.5C5 5.29086 6.79086 3.5 9 3.5C11.2091 3.5 13 5.29086 13 7.5Z" fill="#CB0ACF" fillOpacity="0.3" stroke="#CB0ACF" strokeWidth="1.5" />
        </svg>
    )
}

function ScheduleStatIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.664 6.57831C19.6473 6.75667 19.8679 7.34313 20.1615 8.97048C20.4259 10.4361 20.5 12.1949 20.5 12.9436C20.4731 13.2195 20.3532 13.477 20.1615 13.687C18.1054 15.722 14.0251 19.565 11.9657 21.474C11.1575 22.1555 9.93819 22.1702 9.08045 21.5447C7.32407 20.0526 5.63654 18.366 3.98343 16.8429C3.3193 16.035 3.33487 14.8866 4.0585 14.1255C6.23711 11.9909 10.1793 8.33731 12.4047 6.31887C12.6278 6.1383 12.9012 6.02536 13.1942 6C13.6935 5.99988 14.5501 6.06327 15.3845 6.10896" fill="#08BD66" fillOpacity="0.3" />
            <path d="M18.664 6.57831C19.6473 6.75667 19.8679 7.34313 20.1615 8.97048C20.4259 10.4361 20.5 12.1949 20.5 12.9436C20.4731 13.2195 20.3532 13.477 20.1615 13.687C18.1054 15.722 14.0251 19.565 11.9657 21.474C11.1575 22.1555 9.93819 22.1702 9.08045 21.5447C7.32407 20.0526 5.63654 18.366 3.98343 16.8429C3.3193 16.035 3.33487 14.8866 4.0585 14.1255C6.23711 11.9909 10.1793 8.33731 12.4047 6.31887C12.6278 6.1383 12.9012 6.02536 13.1942 6C13.6935 5.99988 14.5501 6.06327 15.3845 6.10896" stroke="#08BD66" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7.72852 15.2861H12.7285M10.2271 12.7861H10.2364M10.2294 17.7861H10.2388" stroke="#08BD66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.5 3.69682C9.53332 6.78172 14.5357 0.12372 17.4957 2.53998C19.1989 3.93028 18.6605 7 16.4494 9" stroke="#08BD66" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function OverdueStatIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.1528 4.28405C13.9789 3.84839 13.4577 2.10473 12.1198 2.00447C12.0403 1.99851 11.9603 1.99851 11.8808 2.00447C10.5429 2.10474 10.0217 3.84829 8.8478 4.28405C7.60482 4.74524 5.90521 3.79988 4.85272 4.85239C3.83967 5.86542 4.73613 7.62993 4.28438 8.84747C3.82256 10.0915 1.89134 10.6061 2.0048 12.1195C2.10506 13.4574 3.84872 13.9786 4.28438 15.1525C4.73615 16.37 3.83962 18.1346 4.85272 19.1476C5.90506 20.2001 7.60478 19.2551 8.8478 19.7159C10.0214 20.1522 10.5431 21.8954 11.8808 21.9955C11.9603 22.0015 12.0403 22.0015 12.1198 21.9955C13.4575 21.8954 13.9793 20.1521 15.1528 19.7159C16.3704 19.2645 18.1351 20.1607 19.1479 19.1476C20.2352 18.0605 19.1876 16.2981 19.762 15.042C20.2929 13.8855 22.1063 13.3439 21.9958 11.8805C21.8957 10.5428 20.1525 10.021 19.7162 8.84747C19.2554 7.60445 20.2004 5.90473 19.1479 4.85239C18.0955 3.79983 16.3958 4.74527 15.1528 4.28405Z" fill="#D18A00" fillOpacity="0.3" stroke="#D18A00" strokeWidth="1.5" />
            <path d="M12 16H12.009" stroke="#D18A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 13V8" stroke="#D18A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function PeopleBadgeIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.6161 20H19.1063C20.2561 20 21.1707 19.4761 21.9919 18.7436C24.078 16.8826 19.1741 15 17.5 15M15.5 5.06877C15.7271 5.02373 15.9629 5 16.2048 5C18.0247 5 19.5 6.34315 19.5 8C19.5 9.65685 18.0247 11 16.2048 11C15.9629 11 15.7271 10.9763 15.5 10.9312" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4.48131 16.1112C3.30234 16.743 0.211139 18.0331 2.09388 19.6474C3.01359 20.436 4.03791 21 5.32572 21H12.6743C13.9621 21 14.9864 20.436 15.9061 19.6474C17.7889 18.0331 14.6977 16.743 13.5187 16.1112C10.754 14.6296 7.24599 14.6296 4.48131 16.1112Z" fill="#C6C6C6" stroke="black" strokeWidth="1.5" />
            <path d="M13 7.5C13 9.70914 11.2091 11.5 9 11.5C6.79086 11.5 5 9.70914 5 7.5C5 5.29086 6.79086 3.5 9 3.5C11.2091 3.5 13 5.29086 13 7.5Z" fill="#C6C6C6" stroke="black" strokeWidth="1.5" />
        </svg>
    )
}


function Dashboard({ 
    projects, 
    user,  
    setActiveTab,  
    setSelectedProject,
    setOpenProject,
    setActiveSubTab
    }) {

    const safeProjects = Array.isArray(projects) ? projects : []

    const filteredProjects = safeProjects.filter((project) => {
        if (user?.role === "HEADOFOPS") {
            return true; // sees everything
        }

        if (user?.role === "PROJECTMANAGER") {
            return project.projectManager?.email === user.email; 
            // only projects assigned
        }

        return false;
    });

    // const items = 10
    const activeProjects = filteredProjects.filter((project) =>
        !["COMPLETED", "OPEN", "UNASSIGNED"].includes(project.workflowStatus)
    ).slice(0, 10)

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

    const setCurrentStage = (currentStage) => {
        return STAGES[currentStage] || "Unknown Stage";
    };

    const [openProjectMenu, setOpenProjectMenu] = useState(null);

    const statCardBackgroundStyle = {
        backgroundImage:
            "url('https://api.builder.io/api/v1/image/assets/TEMP/aee0652477cf0ab7f5489b896df8a55a5445eb96?width=742')",
        backgroundColor: "#EBEBEB",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    return (
        <div className=''>
            <div className='cursor-pointer p-4'>
                <span className='font-medium text-[14px]/[20px] text-[#949494]'>Home</span> <span className='text-[#949494]'>/</span> <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Dashboard</span>
            </div>
            <div className='flex flex-col gap-2 relative'>
                <div className='border-b-[1.5px] border-[#0000000D] px-4 pb-4'>
                    <h3 className='font-semibold text-[14px]/[20px] text-[#090909] mb-2'>Dashboard</h3>
                    <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>Here's an overview of all activities</p>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>

                        <div className='w-full h-35.75 rounded-lg p-3 flex flex-col justify-between' style={statCardBackgroundStyle}>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>{projects.length}</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>Projects - All</p>
                                </div>
                                <UsersStatIcon />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>See Details</p>
                                <ChevronIcon />
                            </div>
                        </div>

                        <div className='w-full h-35.75 rounded-lg p-3 flex flex-col justify-between' style={statCardBackgroundStyle}>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>0</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>Projects - Within Schedule</p>
                                </div>
                                <ScheduleStatIcon />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>See Details</p>
                                <ChevronIcon />
                            </div>
                        </div>

                        <div className='w-full h-35.75 rounded-lg p-3 flex flex-col justify-between' style={statCardBackgroundStyle}>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>0</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>Projects - Overdue</p>
                                </div>
                                <OverdueStatIcon />
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>See Details</p>
                                <ChevronIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-4 flex flex-col'>
                    <div 
                        className='flex justify-between'>
                        <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Active Project</h3>
                        <button
                            onClick={() => setActiveTab("projects")}
                            className='rounded-md border border-[#0000000D] py-2.5 px-4 font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer hover:border-[#1B3C4A] flex items-center gap-2'>See All <ChevronIcon /></button>
                    </div>

                    {
                        activeProjects !== 0 && (

                            <section className='w-full min-h-0 overflow-auto no-scrollbar rounded-lg border border-[#0000000D] relative mt-6'>
                                <table className='min-w-300 border-collapse whitespace-nowrap'>
                                    <thead className='sticky top-0 z-20 h-11 bg-[#F9FAFB]'>
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
                                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-center'>Status</th>
                                            <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-center'>Stage</th>
                                            <th className='w-15 px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-center'></th>
                                        </tr>
                                    </thead>
                
                                    <tbody className='h-11'>
                                        {
                                            activeProjects.map((project, index) => (
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
                                                            <td title={project.projectManager?.email} className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363]'>{!project.projectManager?.email ? "Not Assigned" : project.projectManager?.email}</td>
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
                                                        className={`py-1 rounded-full ${setCurrentStage(project.currentStageOrder) !== "LOCKED" ? "bg-[#228CEE] text-[#FFFFFF]" : "bg-[#52525B] text-[#F4F4F5]"}`}>{setCurrentStage(project.currentStageOrder)}
                                                        </p>
                                                    </td>
                                                    <td className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363] relative'>
                
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
                                                            className="cursor-pointer text-[#98a2b3] hover:text-[#1B3C4A] " 
                                                        />

                                                        {
                                                            openProjectMenu === project.projectId && (
                                                                <div
                                                                    className='max-h-40 overflow-y-auto no-scrollbar absolute z-1000 w-40 right-5 border border-[#0000000D] bg-[#F9FAFB] rounded-lg text-[14px]/[20px]'>
                                                                    <ul>
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

                                                                                    }}>
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
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </section>
                        )
                    }
                </div>

                {
                    activeProjects.length === 0 && (
                        <div className='flex items-center justify-center py-14 px-4'>
                            <div className='w-full max-w-88 flex flex-col items-center gap-6'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='w-39.5 h-25.25 relative'>
                                        <div className='w-34 flex flex-col gap-2.5 absolute left-2.75 top-0'>
                                            {[0, 1].map((i) => (
                                                <div key={i} className='w-34 h-11.5 rounded-lg border border-[#0000000D] bg-[#F3F3F3] flex items-center gap-1.5 px-1.75 relative'>
                                                    <div className='w-8.25 h-8.25 rounded-sm bg-[#DBDBDB] shrink-0' />
                                                    <div className='flex flex-col gap-1.5'>
                                                        <div className='w-15 h-2.5 rounded-full bg-[#949494] opacity-15' />
                                                        <div className='w-9 h-2.5 rounded-full bg-[#949494] opacity-10' />
                                                    </div>
                                                    <div className='w-3.75 h-2.5 rounded-full bg-[#949494] opacity-10 absolute right-1.75' />
                                                </div>
                                            ))}
                                        </div>
                                        <div className='w-39.5 h-13.25 rounded-lg border border-[#0000000D] bg-[#F3F3F3] flex items-center gap-3.5 px-2 absolute left-0 top-6'>
                                            <div className='w-9.5 h-9.5 rounded-md bg-[#DBDBDB] flex items-center justify-center shrink-0'>
                                                <PeopleBadgeIcon />
                                            </div>
                                            <div className='flex flex-col gap-1.5 flex-1'>
                                                <div className='w-17.5 h-2.75 rounded-full bg-[#949494] opacity-15' />
                                                <div className='w-10.25 h-2.75 rounded-full bg-[#949494] opacity-8' />
                                            </div>
                                            <div className='w-4.5 h-2.75 rounded-full bg-[#949494] opacity-10' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-center gap-1'>
                                        <h2 className='font-medium text-[16px]/[24px] text-[#090909] text-center'>No projects assigned</h2>
                                        <p className='font-normal text-[14px]/[20px] text-[#636363] text-center'>You do not have any projects.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Dashboard
