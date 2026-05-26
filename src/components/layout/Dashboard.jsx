import React from 'react'
import bgSignInTwo from "../../assets/bgSignInTwo.jpg"
import { FaUserFriends, FaTag, FaExclamationCircle, FaEllipsisV } from 'react-icons/fa'


function Dashboard({ 
    projects, 
    user, 
    activeTab, 
    setActiveTab, 
    selectedProject, 
    setSelectedProject }) {

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

    const items = 10
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
    
    return (
        <div className=''>
            <div className='cursor-pointer p-4'>
                <span className='font-medium text-[14px]/[20px] text-[#949494]'>Home</span> <span className='text-[#949494]'>/</span> <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Dashboard</span>
            </div>
            <div className='flex flex-col gap-2 relative'>
                <div className='border-b-[1.5px] border-[#0000000D] px-4 pb-4'>
                    <h3 className='font-semibold text-[14px]/[20px] text-[#090909] mb-2'>Dashboard</h3>
                    <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>Here's an overview of all activities</p>
                    <div className='flex gap-2'>
                        
                        <div className='w-92.75 h-35.75 rounded-lg p-3 bg-[#EBEBEB] flex flex-col justify-between'>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>{projects.length}</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>Projects - All</p>
                                </div>
                                <FaUserFriends className='text-[#CB0ACF] text-2xl rounded-full'/>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>See Details</p>
                                <p className='font-medium text-[16px]/[20px] text-[#1B3C4A]'>{'>'}</p>
                            </div>
                        </div>

                        <div className='w-92.75 h-35.75 rounded-lg p-3 bg-[#EBEBEB] flex flex-col justify-between'>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>0</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>Projects - Within Schedule</p>
                                </div>
                                <FaTag className='text-[#08BD66] text-2xl rounded-full'/>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>See Details</p>
                                <p className='font-medium text-[16px]/[20px] text-[#1B3C4A]'>{'>'}</p>
                            </div>
                        </div>

                        <div className='w-92.75 h-35.75 rounded-lg p-3 bg-[#EBEBEB] flex flex-col justify-between'>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>0</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>Projects - Overdue</p>
                                </div>
                                <FaExclamationCircle className='text-[#D18A00] text-2xl rounded-full'/>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>See Details</p>
                                <p className='font-medium text-[16px]/[20px] text-[#1B3C4A]'>{'>'}</p>
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
                            className='rounded-md border border-[#0000000D] py-2.5 px-4 font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer hover:border-[#1B3C4A]'>See All {'>'}</button>
                    </div>

                    <section className='w-full min-h-0 overflow-auto no-scrollbar rounded-lg border border-[#0000000D] relative mt-6'>
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
                                    <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-center'>Status</th>
                                    <th className='px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-center'>Stage</th>
                                    <th className='w-15 px-4 py-3 font-semibold text-[12px]/[18px] text-[#090909] text-center'></th>
                                </tr>
                            </thead>
        
                            <tbody className='h-11'>
                                {
                                    activeProjects.map((project, index) => (
                                        <tr key={index} className='border-y border-[#0000000D] cursor-pointer'>
                                            <td className='px-4 py-4 font-normal text-[14px]/[20px] text-[#636363] overflow-hidden whitespace-nowrap text-ellipsis'>{project.externalId}</td>
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
                </div>

                {
                    activeProjects.length === 0 && (
                        <div className='flex items-center justify-center py-14'>
                            <div className='text-center'>
                                <h2 className='font-bold text-[16px]/[24px] text-[#090909] '>No Active Projects</h2>
                                <p className='font-normal text-[14px]/[20px] text-[#636363]'>You do not have any active projects</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Dashboard