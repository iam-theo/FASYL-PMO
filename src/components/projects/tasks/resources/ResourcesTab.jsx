import { useMemo, useState } from "react";
// import { AiTwotonePlusCircle } from "react-icons/ai"
import ResourceCard from "./ResourceCard";
// import AddResourceModal from './AddResourceModal'
// import RemoveResourceModal from './RemoveResourceModal'
// import { AVAILABLE_RESOURCES, INITIAL_PROJECT_RESOURCES } from './mockResources'

const ITEMS_PER_PAGE = 6;

function ResourcesTab({ project }) {
  // console.log(project)

  // const [resources, setResources] = useState(project)
  const [currentPage, setCurrentPage] = useState(1);
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // const [resourceToRemove, setResourceToRemove] = useState(null)

  const resources = project?.resources;

  const totalPages = Math.max(1, Math.ceil(resources?.length / ITEMS_PER_PAGE));

  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return resources.slice(start, start + ITEMS_PER_PAGE);
  }, [resources, currentPage]);

  // const availableToAdd = useMemo(
  //     () => AVAILABLE_RESOURCES.filter((resource) => !resources.some((r) => r.id === resource.id)),
  //     [resources]
  // )

  // const handleAddResources = (resourceIds) => {
  //     const newResources = AVAILABLE_RESOURCES.filter((resource) => resourceIds.includes(resource.id))
  //     if (newResources.length > 0) {
  //         setResources((prev) => [...prev, ...newResources])
  //     }
  //     setIsAddModalOpen(false)
  // }

  // const handleRemoveResource = (resource) => {
  //     setResources((prev) => prev.filter((r) => r.id !== resource.id))
  //     setResourceToRemove(null)
  // }

  return (
    <div className="ml-5 flex flex-col h-full">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-50 max-w-100 rounded-lg border border-[#0000001A] bg-[#FFFFFF] px-3.5 py-2.5 flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass text-[#090909]"></i>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none font-normal text-[14px]/[24px] text-[#636363] bg-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#E8E8E8] flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-file-export text-[#090909]"></i>
              <span className="font-medium text-[14px]/[20px] text-[#1B3C4A]">
                Export
              </span>
            </button>

            {/* <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className='px-4 py-2.5 rounded-lg border border-[#0000000D] bg-[#1B3C4A] flex items-center gap-2 cursor-pointer'
                        >
                            <AiTwotonePlusCircle size={18} className='text-[#FFFFFF]' />
                            <span className='font-medium text-[14px]/[20px] text-[#FFFFFF]'>Add New Resource</span>
                        </button> */}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-4">
        {resources.length === 0 ? (
          <div className="w-full py-20 text-center font-normal text-[14px]/[20px] text-[#636363]">
            No resources assigned to this project yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedResources.map((resource) => (
              <ResourceCard
                key={resource.recordId}
                resource={resource}
                // onRemove={setResourceToRemove}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#0000000D] bg-[#F2F2F2] px-6 py-4 flex items-center justify-between">
        <p className="font-medium text-[14px]/[20px] text-[#636363]">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E8E8E8] disabled:hover:text-[#1B3C4A]"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-[#0000000D] shadow-[2px] shadow-[#1018280D] py-2.25 px-4.25 bg-[#E8E8E8] hover:bg-[#1B3C4A] font-medium text-[14px]/[20px] text-[#1B3C4A] hover:text-[#FFFFFF] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#E8E8E8] disabled:hover:text-[#1B3C4A]"
          >
            Next
          </button>
        </div>
      </div>

      {/* {isAddModalOpen && (
                <AddResourceModal
                    availableResources={availableToAdd}
                    onClose={() => setIsAddModalOpen(false)}
                    onConfirm={handleAddResources}
                />
            )}

            {resourceToRemove && (
                <RemoveResourceModal
                    resource={resourceToRemove}
                    onCancel={() => setResourceToRemove(null)}
                    onConfirm={handleRemoveResource}
                />
            )} */}
    </div>
  );
}

export default ResourcesTab;
