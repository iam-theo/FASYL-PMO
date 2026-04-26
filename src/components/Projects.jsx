import React from 'react'
import { useEffect, useState, useRef } from 'react'

function Projects() {
    const [projects, setProjects] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const hasFetched = useRef(false)

    const itemsPerPage = 10
    const totalPages = Math.ceil(projects.length / itemsPerPage)
    const startIndex = (currentPage -1) * itemsPerPage
    const currentProjects = projects.slice(
        startIndex, startIndex + itemsPerPage
    )

    useEffect(() => {
        const getProjects = async () => {
            if(hasFetched.current) return;

            hasFetched.current = true;
            try {
                const res = await fetch("/mockProjects/projects.json")
                
                if(!res.ok) {
                    throw new Error("Failed to fetch data")
                }

                const data = await res.json()
                console.log(data)
                setProjects(data)
            } catch (err) {
                console.error(err);
            } finally {
                setisLoading(false)
            }
        }
        getProjects();
    }, [])

    if(isLoading) return <p>Loading...</p>

    return (
        <div className='p-4 flex flex-col h-[92%]'>
            <div className='cursor-pointer'>
                <span className='font-medium text-[14px]/[20px] text-[#949494]'>Dashboard</span> <span className='text-[#949494]'>/</span> <span className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>Projects</span>
            </div>
            <div className='flex items-center justify-between gap-2 relative'>
                <div className='py-4'>
                    <h3 className='font-semibold text-[14px]/[20px] text-[#090909] mb-2'>Projects</h3>
                    <p className='font-normal text-[14px]/[20px] text-[#636363] mb-3'>View all assigned projects</p>
                </div>

                <div className='w-94.5 h-10 flex items-center gap-3 relative'>
                    <i class="fa-solid fa-magnifying-glass text-[#090909] absolute left-3"></i>
                    <input type="text" placeholder='Search' className='w-72.25 border border-[#00000026] py-2.5 px-8.5 bg-[#FFFFFF] rounded-lg'/>
                    <div className='w-19.25 rounded-lg flex gap-2 items-center border border-[#0000000D] bg-[#E8E8E8] hover:bg-[#1B3C4A] text-[#1B3C4A] hover:text-[#E8E8E8] py-2.5 px-4 cursor-pointer'>
                        <i class="fa-solid fa-sliders fa-md text-[#636363]"></i>
                        <p className='font-medium text-[14px]/[20px]'>All</p>
                    </div>
                </div>

                {/* <div className='flex items-center justify-center w-lg h-104.5 absolute top-10 left-61 py-14'>
                    <div className='text-center'>
                        <p>No projects assigned</p>
                        <p>You do not have any projects</p>
                    </div>
                </div> */}
            </div>

            <section className='w-full'>
                <table className='border-collapse rounded-lg border border-[#0000000D] w-full'>
                    <thead>
                        <tr className='text-left'>
                            <th className='w-47 py-3 px-6 bg-[#F9FAFB] font-semibold text-[12px]/[18px] text-[#090909]'>ID</th>
                            <th className='w-47 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909]'>Project Name</th>
                            <th className='w-47 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909]'>Client</th>
                            <th className='w-47 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909]'>Product</th>
                            <th className='w-47 bg-[#F9FAFB] py-3 px-6 font-semibold text-[12px]/[18px] text-[#090909]'>Status</th>
                        </tr>
                    </thead>

                    <tbody className=''>
                        {
                            currentProjects.map((project) => (
                                <tr key={project["ID"]} className='border-y border-[#0000000D]'>
                                    <td className='w-47 py-4 px-6 font-normal text-[14px]/[20px] text-[#636363]'>{project["ID"]}</td>
                                    <td className='w-47 py-4 px-6 font-normal text-[14px]/[20px] text-[#636363]'>{project["Project Name"]}</td>
                                    <td className='w-47 py-4 px-6 font-normal text-[14px]/[20px] text-[#636363]'>{project["Client"]}</td>
                                    <td className='w-47 py-4 px-6 font-normal text-[14px]/[20px] text-[#636363]'>{project["Product"]}</td>
                                    <td className='w-47 py-4 px-6 font-normal text-[14px]/[20px] text-[#FFFFFF] flex items-center justify-between'>
                                        <p className='rounded-2xl py-1 px-2 bg-[#228CEE]'>{project["Status"]}</p>
                                        <i className="fa-solid fa-ellipsis-vertical fa-lg cursor-pointer text-[#98a2b3] hover:text-[#1B3C4A]"></i>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>

            <div className='border-t border-[#0000000D] mt-auto flex items-center justify-between w-full py-6'>
                <p className='font-medium text-[14px]/[20px] text-[#636363]'>Page {currentPage} of {totalPages}</p>
                <div className='flex items-center gap-2'>
                    <button onClick={() => setCurrentPage((p) => Math.max(p -1, 1))} className='rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF]'>Previous</button>
                    <button onClick={() => 
                        setCurrentPage((p) => 
                            p < Math.ceil(projects.length / itemsPerPage)
                            ? p + 1
                            : p
                    )} className='rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF]'>Next</button>
                </div>
            </div>
        </div>
    )
}

export default Projects