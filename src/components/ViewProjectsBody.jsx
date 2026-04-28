import React from 'react'
import ProjectLifeCycle from './ProjectLifeCycle'
import ProjectDetails from './ProjectDetails'
import { useState, useEffect, useRef } from 'react'

function ViewProjectsBody({ project, onClose, activeDetails, setActiveDetails }) {
    const [lifecycle, setLifecycle] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const hasFetched = useRef(false)

    const tabs = [
        { name: "project_lifecycle", label: "Project Lifecycle"},
        { name: "project_details", label: "Project Details"}
    ]

    useEffect(() => {
        const getLifeCycle = async () => {
            if(hasFetched.current) return;

            hasFetched.current = true

            try {
                const res = await fetch("/mockProjects/ProjectLifeCycle.json")

                if(!res.ok) {
                    throw new Error("failed to fetch data")
                }

                const data = await res.json()
                setLifecycle(data)
            } catch(err) {
                console.log(err)
            } finally {
                setisLoading(false)
            }
        }
        getLifeCycle();
    }, [lifecycle])

    if(isLoading) return <p>Loading...</p>

    return (
        <div className='absolute z-2000 w-full h-full bg-[#00000080] flex flex-col items-end overflow-y-auto overscroll-contain'>
            <div className='flex flex-col w-135.5 h-430 overflow-y-auto overscroll-contain bg-[#F7F7F7] px-4 py-4'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='font-semibold text-[16px]/[20px] text-[#090909]'>Project Details</h2>
                    <button onClick={onClose} className='px-4 py-2.5 rounded-lg border border-[#000000] bg-[#E8E8E8] flex items-center gap-2 cursor-pointer'>
                        <p className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>close</p>
                        <i className="fa-regular fa-circle-xmark fa-sm"></i>
                    </button>
                </div>
                
                <div className='flex items-center justify-between mb-4'>
                    {
                        tabs.map((tab) => (
                            <button 
                            key={tab.name}
                            onClick={() => setActiveDetails(tab.name)}
                            className={`rounded-lg border border-[#0000000D] w-56.25 h-10 px-4 py-2.5 font-medium text-[14px]/[20px] text-center cursor-pointer hover:text-[#1B3C4A] ${
                            activeDetails === `${tab.name}`
                            ? "bg-[#E8E8E8] text-[#1B3C4A]"
                            : "text-[#636363]"
                        }`}>{tab.label}</button>
                        ))
                    }
                </div>

                <section>
                    {activeDetails === "project_lifecycle" && <ProjectLifeCycle lifecycle={lifecycle} project={project}/>}
                    {activeDetails === "project_details" && <ProjectDetails project={project}/>}
                </section>
            </div>
        </div>
    )
}

export default ViewProjectsBody