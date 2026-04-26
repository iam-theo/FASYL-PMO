import React from 'react'
import SideBar from './SideBar'
import MainSection from './MainSection'

function MainBody() {
    return (
        <div className='relative flex max-w-360 min-h-screen bg-[#FFFFFF]'>
        <SideBar />
        <MainSection />
        </div>
    )
}

export default MainBody