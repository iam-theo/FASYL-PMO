import React from 'react'

function selectedProjectDetails( {selectedProject} ) {
    return (
        <div className='w-full flex flex-col gap-4 py-4'>
            <div className='w-full h-100 rounded-lg border border-[#0000000D] bg-[#F3F3F3] flex flex-col gap-4 justify-center p-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>{selectedProject.project_name}</h3>
                <ul className='flex flex-col gap-4'>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-user-tie fa-lg text-[#1b3c4a]"></i>
                        <p>Client - {selectedProject.client}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-square-poll-horizontal text-[#1b3c4a]"></i>
                        <p>Type- {selectedProject.type}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-brands fa-lg fa-product-hunt text-[#1b3c4a]"></i>
                        <p>Product - {selectedProject.product}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-globe text-[#1b3c4a]"></i>
                        <p>Location - {selectedProject.location}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-qrcode text-[#1b3c4a]"></i>
                        <p>Sitecode - {selectedProject.site_code}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-coins text-[#1b3c4a]"></i>
                        <p>AMC - {selectedProject.amc}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                    <i className="fa-solid fa-lg fa-registered text-[#1b3c4a]"></i>
                        <p>Register For - {selectedProject.register_for}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-calendar-day text-[#1b3c4a]"></i>
                        <p>Purchase Order Date - {selectedProject.purchase_order_date}</p>
                    </li>
                    <li className='font-normal text-[16px]/[20px] text-[#636363] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-calendar-day text-[#1b3c4a]"></i>
                        <p>Expected Commencement Date - {selectedProject.commencement_date}</p>
                    </li>
                </ul>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Assigned Project Manager</h3>
                <div className='w-full p-4 rounded-lg border border-[#0000000D] flex items-center gap-4'>
                    <div className='font-medium text-[16px]/[20px] text-[#090909] flex items-center gap-2'>
                        <i className="fa-solid fa-lg fa-user-secret text-[#1B3C4A]"></i>
                        <p>{selectedProject.project_manager}</p>
                    </div>
                    <p className='font-normal text-[16px]/[20px] text-[#636363]'>Project Manager</p>
                        </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Order Letter</h3>
                    <div className='w-full p-4 rounded-lg border border-[#0000000D] flex items-center justify-between'>
                        <div className='font-normal text-[14px]/[20px] text-[#636363] flex items-center gap-4'>
                            <i className="fa-solid fa-lg fa-circle-arrow-up text-[#1B3C4A]"></i>
                            <p>{selectedProject.order_letter}</p>
                        </div>
                        <button className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>View</button>
                    </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Cost Sheet</h3>
                <div className='w-full p-4 rounded-lg border border-[#0000000D] flex items-center justify-between'>
                    <div className='font-normal text-[14px]/[20px] text-[#636363] flex items-center gap-4'>
                        <i className="fa-solid fa-lg fa-circle-arrow-up text-[#1B3C4A]"></i>
                        <p>{selectedProject.cost_sheet}</p>
                    </div>
                    <button className='font-medium text-[14px]/[20px] text-[#1B3C4A]'>View</button>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Addition Information</h3>
                <div className='font-normal text-[16px]/[24px] text-[#636363] w-full px-3.5 py-2.5 rounded-lg border border-[#0000000D] flex items-center'>
                    <p>{selectedProject.additional_info}</p>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <h3 className='font-semibold text-[16px]/[20px] text-[#090909]'>Fasyl Sales</h3>
                {
                    selectedProject.sales.map((s, index) => (
                        <div 
                        key={index}
                        className='w-full p-4 rounded-lg border border-[#0000000D] flex flex-col justify-between gap-2.5'>
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

export default selectedProjectDetails