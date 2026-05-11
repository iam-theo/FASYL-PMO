import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function Projects({ setSelectedProject, user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* =========================
     FETCH PROJECTS
  ========================== */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");

        const data = res.data?.projects || res.data || [];
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* =========================
     PAGINATION
  ========================== */
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="p-4 text-[#636363] font-medium">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 flex flex-col h-screen">

      {/* BREADCRUMB */}
      <div>
        <span className="text-[#949494] font-medium text-sm">
          Dashboard
        </span>
        <span className="text-[#949494]"> / </span>
        <span className="text-[#1B3C4A] font-medium text-sm">
          Projects
        </span>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center py-4">
        <div>
          <h3 className="font-semibold text-[#090909]">Projects</h3>
          <p className="text-sm text-[#636363]">
            View all assigned projects
          </p>
        </div>
      </div>

      {/* TABLE */}
      <section className="w-full flex-1 overflow-auto border border-[#0000000D] rounded-lg">

        <table className="w-full table-fixed border-collapse">

          {/* HEADER */}
          <thead className="sticky top-0 bg-[#F9FAFB] z-10">
            <tr className="text-left text-xs text-[#090909]">

              <th className="p-3 w-20">ID</th>
              <th className="p-3">Project</th>
              <th className="p-3">Client</th>
              <th className="p-3">Product</th>

              {user?.role === "HEADOFOPS" && (
                <th className="p-3">PM</th>
              )}

              <th className="p-3">Status</th>
              <th className="p-3 w-12"></th>

            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentProjects.map((project) => (
              <tr
                key={project.id}
                className="border-t border-[#0000000D]"
              >

                <td className="p-3 text-sm text-[#636363]">
                  {project.id}
                </td>

                <td className="p-3 text-sm text-[#636363]">
                  {project.projectName}
                </td>

                <td className="p-3 text-sm text-[#636363]">
                  {project.clientName}
                </td>

                <td className="p-3 text-sm text-[#636363]">
                  {project.productName}
                </td>

                {user?.role === "HEADOFOPS" && (
                  <td className="p-3 text-sm text-[#636363]">
                    {project.projectManager || "Not Assigned"}
                  </td>
                )}

                <td className="p-3">
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                    {project.workflowStatus}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <i
                    onClick={() => setSelectedProject(project)}
                    className="fa-solid fa-ellipsis-vertical cursor-pointer text-[#98a2b3] hover:text-[#1B3C4A]"
                  />
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </section>

      {/* PAGINATION */}
      <div className="flex justify-between items-center py-4">
        <p className="text-sm text-[#636363]">
          Page {currentPage} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev
          </button>

          <button
            onClick={() =>
              setCurrentPage((p) => (p < totalPages ? p + 1 : p))
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

export default Projects;