import React from 'react'
import bgSignInTwo from "../assets/bgSignInTwo.jpg"
import { FaUserFriends, FaTag, FaExclamationCircle } from 'react-icons/fa'

function Dashboard() {
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
                                    <p className='font-semibold text-[16px]/[20px] text-[#090909] mb-2'>0</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>Projects - Active</p>
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
                    <div className='flex justify-between'>
                        <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Active Project</h3>
                        <p className='rounded-md border border-[#0000000D] py-2.5 px-4 font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>See All {'>'}</p>
                    </div>
                </div>

                <div className='flex items-center justify-center absolute top-75.75 left-110 py-14'>
                    <div className='text-center'>
                        <p>No projects assigned</p>
                        <p>You do not have any projects</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard