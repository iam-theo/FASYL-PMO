import React from 'react'
import { useState } from 'react'
import SideBar from './SideBar'
import MainSection from './MainSection'
// import Dashboard from './Dashboard'
// import Projects from './Projects'

function MainBody() {
    const [activeTab, setActiveTab] = useState("dashboard")

    return (
        <div className='relative flex max-w-360 min-h-screen bg-[#FFFFFF]'>
            <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
            <MainSection activeTab={activeTab} />
        </div>
    )
}

export default MainBody