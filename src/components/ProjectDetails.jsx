import React from 'react'

function ProjectDetails( {project} ) {
    return (
        <div className='w-full flex flex-col gap-4 py-4'>
            <div className='w-full h-100 rounded-lg border border-[#0000000D] bg-[#F3F3F3] flex flex-col gap-4 justify-center p-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>{project.project_name}</h3>
                <ul className='flex flex-col gap-4'>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-user-tie fa-lg text-[#1b3c4a]"></i>
                        <p>Client - {project.client}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-square-poll-horizontal text-[#1b3c4a]"></i>
                        <p>Type- {project.type}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-brands fa-lg fa-product-hunt text-[#1b3c4a]"></i>
                        <p>Product - {project.product}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-globe text-[#1b3c4a]"></i>
                        <p>Location - {project.location}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-qrcode text-[#1b3c4a]"></i>
                        <p>Sitecode - {project.site_code}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-coins text-[#1b3c4a]"></i>
                        <p>AMC - {project.amc}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                    <i className="fa-solid fa-lg fa-registered text-[#1b3c4a]"></i>
                        <p>Register For - {project.register_for}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-calendar-day text-[#1b3c4a]"></i>
                        <p>Purchase Order Date - {project.purchase_order_date}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-calendar-day text-[#1b3c4a]"></i>
                        <p>Expected Commencement Date - {project.commencement_date}</p>
                    </li>
                </ul>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Assigned Project Manager</h3>
                <div className='w-full p-4 rounded-lg border border-[#0000000D] flex items-center gap-4'>
                    <div className='font-medium text-[16px]/[20px] text-[#090909] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-user-secret text-[#1B3C4A]"></i>
                        <p>{project.project_manager}</p>
                    </div>
                    <p className='font-normal text-[16px]/[20px] text-[#636363]'>Project Manager</p>
                        </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Order Letter</h3>
                    <div className='w-full p-4 rounded-lg border border-[#0000000D] flex items-center justify-between'>
                        <div className='font-normal text-[14px]/[20px] text-[#636363] flex items-center gap-4'>
                            <i className="fa-solid fa-lg fa-circle-arrow-up text-[#1B3C4A]"></i>
                            <p>{project.order_letter}</p>
                        </div>
                        <button className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>View</button>
                    </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Cost Sheet</h3>
                <div className='w-full p-4 rounded-lg border border-[#0000000D] flex items-center justify-between'>
                    <div className='font-normal text-[14px]/[20px] text-[#636363] flex items-center gap-4'>
                        <i className="fa-solid fa-lg fa-circle-arrow-up text-[#1B3C4A]"></i>
                        <p>{project.cost_sheet}</p>
                    </div>
                    <button className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>View</button>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Addition Information</h3>
                <div className='font-normal text-[16px]/[24px] text-[#636363] w-full px-3.5 py-2.5 rounded-lg border border-[#0000000D] flex items-center'>
                    <p>{project.additional_info}</p>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Fasyl Sales</h3>
                {
                    project.sales.map((s) => (
                        <div className='w-full p-4 rounded-lg border border-[#0000000D] flex flex-col justify-between gap-2.5'>
                            <div className='font-semibold text-[16px]/[20px] text-[#090909] flex items-center gap-2'>
                                <i className="fa-solid fa-lg fa-address-card text-[#1B3C4A]"></i>
                                <p>{s.name}</p>
                            </div>
                            <p className='font-normal text-[16px]/[20px] text-[#636363]'>{s.email}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ProjectDetails