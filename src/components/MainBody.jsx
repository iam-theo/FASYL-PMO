import React, { useEffect } from 'react'
import { useState } from 'react'
import SideBar from './SideBar'
import MainSection from './MainSection'
import ViewProjectsBody from './ViewProjectsBody'
import ProjectLifeCycle from './ProjectLifeCycle'
// import Dashboard from './Dashboard'
// import Projects from './Projects'

function MainBody() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [activeDetails, setActiveDetails] = useState("project_lifecycle")
    const [selectedProject, setSelectedProject] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='relative flex max-w-360 h-screen bg-[#FFFFFF]'>
            <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

            <MainSection activeTab={activeTab} setSelectedProject={setSelectedProject}/>

            {selectedProject && (
                <ViewProjectsBody 
                    project={selectedProject} 
                    onClose={() => setSelectedProject(null)}
                    activeDetails={activeDetails}
                    setActiveDetails={setActiveDetails}
                />
            )}
        </div>
    )
}

export default MainBody