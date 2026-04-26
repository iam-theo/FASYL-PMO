import React from 'react'

function SideBar() {
    return (
        <div className='w-[19.44%] h-screen bg-[#FFFFFF] pb-4 fixed flex flex-col  border-r-[1.5px] border-[#0000000D]'>
            <div className='flex items-center gap-3 border-b-[1.5px] border-[#0000000D] p-4 h-18'>
                <div className='w-10 h-10 rounded-sm font-medium text-[16px]/[24px] text-[#FFFFFF] bg-[#1B3C4A] flex items-center justify-center'>F</div>
                <div>
                    <p className='font-medium text-[14px]/[20px] text-[#090909]'>Fasyl Help-Desk</p>
                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>PMO</p>
                </div>
            </div>
            <div className='flex flex-col items-start justify-between p-4 pb-4 h-full'>
                <ul className='cursor-pointer'>
                    <li className='py-2 px-3 flex items-center gap-2'>
                        <i className="fa-solid fa-gauge fa-lg" style={{ "color": "#949494" }}></i>
                        <p className='font-medium text-[16px]/[24px] text-[#000000]'>Dashboard</p>
                    </li>
                    <li className='py-2 px-3 flex items-center gap-2'>
                        <i className="fa-solid fa-bars-progress fa-lg" style={{ "color": "#949494" }}></i>
                        <p className='font-medium text-[16px]/[24px] text-[#000000]'>Projects</p>
                    </li>
                </ul>
                <div className='flex items-center gap-2 cursor-pointer'>
                    <i className="fa-solid fa-arrow-right-from-bracket fa-lg" style={{ "color": "#d20019" }}></i>
                    <p className='py-2 px-3 font-medium text-[16px]/[24px] text-[#D20019] mt-auto'>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default SideBar