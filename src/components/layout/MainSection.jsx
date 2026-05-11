import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Projects from "../projects/Projects";
import { FaBell, FaUserTag } from "react-icons/fa";

function MainSection({
  activeTab,
  setSelectedProject,
  projects = [],
  user = {},
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(projects.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ safe initials
  const initials =
    user?.fullName
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("") || "U";

  return (
    <div className="w-full lg:w-[80%] lg:ml-[20%] h-screen relative">

      {/* HEADER */}
      <header className="border-b p-4 flex items-center justify-between bg-white fixed w-full lg:w-[80%] h-18 z-50">

        {/* LEFT */}
        <ul className="flex gap-2">
          <li className="flex items-center justify-between rounded-md px-3 py-2 bg-gray-100 w-40">
            <div className="flex items-center">
              <FaBell className="text-blue-400 text-xl" />
              <p className="ml-2 text-sm text-gray-600">Notifications</p>
            </div>
            <p>0</p>
          </li>

          <li className="flex items-center justify-between rounded-md px-3 py-2 bg-gray-100 w-40">
            <div className="flex items-center">
              <FaUserTag className="text-yellow-600 text-xl" />
              <p className="ml-2 text-sm text-gray-600">Tickets</p>
            </div>
            <p>0</p>
          </li>
        </ul>

        {/* RIGHT */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 font-medium">
            {initials}
          </div>

          <div>
            <p className="text-sm font-medium">{user?.fullName || "User"}</p>
            <p className="text-sm text-gray-500">{user?.email || ""}</p>
          </div>
        </div>
      </header>

      {/* BODY */}
      <section className="mt-18 h-full px-4">
        {activeTab === "dashboard" && <Dashboard />}

        {activeTab === "projects" && (
          <Projects
            projects={projects}
            currentProjects={currentProjects}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setSelectedProject={setSelectedProject}
            user={user}
          />
        )}
      </section>
    </div>
  );
}

export default MainSection;