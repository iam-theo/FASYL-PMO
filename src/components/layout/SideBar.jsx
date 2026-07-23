import React from 'react'
import { AiTwotoneDashboard, AiTwotoneFolderOpen } from "react-icons/ai";
import { FaTasks } from "react-icons/fa"

function SideBar({ activeTab, setActiveTab, setOpenProject, handleLogout }) {
    const tabs = [
        { name: "dashboard", label: "Dashboard"},
        { name: "projects", label: "Projects"},
        // { name: "tasks", label: "Tasks"}
    ]

    return (
        <div className='w-[19.44%] h-screen bg-[#FFFFFF] pb-4 fixed flex flex-col  border-r-[1.5px] border-[#0000000D]'>
            <div className='flex items-center gap-3 border-b-[1.5px] border-[#0000000D] p-4 h-18'>
                <div className='w-10 h-10 rounded-sm font-medium text-[16px]/[24px] text-[#FFFFFF] bg-[#1B3C4A] flex items-center justify-center'>F</div>
                <div>
                    <p className='font-medium text-[14px]/[20px] text-[#090909]'>Fasyl PMO Portal</p>
                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>PMO</p>
                </div>
            </div>
            <div className='flex flex-col items-start justify-between p-4 pb-4 h-full'>
                <div className='cursor-pointer w-full flex flex-col gap-2'>
                    {
                        tabs.map((tab) => (
                            <button 
                                key={tab.name} 
                                onClick={() => {
                                    setActiveTab(tab.name),
                                    setOpenProject(false)
                                }}  
                                className={`w-full py-2 px-3 flex items-center gap-3 rounded-md cursor-pointer ${
                                    activeTab === `${tab.name}`
                                    ? "bg-[#0000000D] text-[#1B3C4A]"
                                    : "text-[#000000] hover:text-[#1B3C4A]"
                                }`}>
                                <div 
                                className='w-6 h-6 flex items-center justify-center rounded-full'>
                                    {/* <i className={`fa-solid ${tab.icon} fa-lg text-[#1B3C4A]`}></i> */}
                                    {
                                        tab.name === "dashboard"
                                            ? <AiTwotoneDashboard
                                                className="text-5xl"
                                            />
                                            : tab.name === "projects" 
                                            ? <AiTwotoneFolderOpen
                                                className="text-5xl"
                                            /> 
                                            : null
                                            // <FaTasks 
                                            //     className="text-xl" 
                                            // />
                                    }
                                </div>
                                <p className='font-medium text-[16px]/[24px]'>{tab.label}</p>
                            </button>
                        ))
                    }
                </div>
                <div 
                onClick={handleLogout}
                className='flex items-center gap-2 cursor-pointer'>
                    <i className="fa-solid fa-arrow-right-from-bracket fa-lg" style={{ "color": "#d20019" }}></i>
                    <p className='py-2 px-3 font-medium text-[16px]/[24px] text-[#D20019] mt-auto'>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default SideBar