import React from 'react'
import bgSignInTwo from "../../assets/bgSignInTwo.jpg"
import { FaUserFriends, FaTag, FaExclamationCircle, FaEllipsisV } from 'react-icons/fa'


function Dashboard({ projects, user, activeTab, setActiveTab, selectedProject, setSelectedProject }) {

    const safeProjects = Array.isArray(projects) ? projects : []

    const filteredProjects = safeProjects.filter((project) => {
        if (user?.role === "HEADOFOPS") {
            return true; // sees everything
        }

        if (user?.role === "PROJECTMANAGER") {
            return project.projectManagerEmail === user.email; 
            // only projects assigned
        }

        return false;
    });

    const items = 10
    const currentProjects = filteredProjects.filter((project) =>
        project.workflowStatus === "SUBMITTED"
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

                    <section className='w-full min-h-0 overflow-y-auto no-scrollbar border-collapse rounded-lg border border-[#0000000D] relative mt-6'>
                        <table className='w-360'>
                            <thead className='sticky top-0 z-2000 h-11'>
                                <tr className='text-left'>
                                    <th className='w-25 py-3 px-6 bg-[#F9FAFB] font-semibold text-[12px]/[18px] text-[#090909] justify-center'>ID</th>
                                    <th className='w-50 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>Project Name</th>
                                    <th className='w-50 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909] justify-center'>Client</th>
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
                </div>

                {/* <div className='flex items-center justify-center absolute top-75.75 left-110 py-14'>
                    <div className='text-center'>
                        <p>No projects assigned</p>
                        <p>You do not have any projects</p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Dashboard