import React from 'react'
import { useState, useRef } from 'react'
import { validateImageDimensions, processFile, handleFileChange, handleDragLeave, handleDragOver, handleDrop } from './utils/UploadFiles'

function UploadBox({
    title,
    formats = "SVG, JPG, GIF",
    maxSizeMB = 2,
    projects,
    selectedProject,
    preview, 
    setPreview
}) {
    const inputRef = useRef(null)
    const [fileName, setFileName] = useState("")
    const [error, setError] = useState("")
    // const [isDragging, setIsDragging] = useState(false)
    // const [isUploaded, setIsUploaded] = useState(false)

    const allowedTypes = ["image/svg+xml", "image/jpeg", "image/gif"]

    // Open file picker
    const handleClick = () => {
        inputRef.current.click()
    }

    const handlePreview = () => {
        window.open(preview, "_blank")
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='mb-3'>
                <h2 className='font-medium text-[14px]/[20px] text-[#090909] mb-1.5'>{title}</h2>
                {/* Upload Box */}
                <div
                    onDragOver={(e) => handleDragOver(e)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e)}
                    className='w-full h-27.5 rounded-lg border border-dashed bg-[#FFFFFF] border-[#E4E7EC] flex items-center justify-center cursor-pointer px-4'>
                    {/* Hidden Input */}
                    <input 
                        ref={inputRef}
                        type="file"
                        className='hidden'
                        accept="image/svg+xml,image/jpeg,image/gif"
                        onChange={(e) => handleFileChange(e)} 
                    />
                    {/* Content */}
                    <div className='w-full'>
                        {
                            !isUploaded 
                            ? <div className='text-center w-full'>
                                    <i className="fa-solid fa-circle-arrow-up text-[#1B3C4A] mt-3"></i>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'><span onClick={handleClick} className='text-[#1B3C4A] font-medium'>Click to upload</span> or drag and drop</p>
                                    <p className='font-normal text-[14px]/[20px] text-[#636363]'>{formats} (max. 800x400px)</p>

                                    {/* Error */}
                                    {error && (
                                        <p className='text-[14px]/[20px] text-[#D20019] font-medium'>{error}</p>
                                    )}
                                </div>
                            : <div className='w-full flex-col'>
                                {/* File Name */}
                                {fileName && (
                                    <p 
                                        className='text-[16px]/[20px] text-[#636363] font-medium mb-4'>{fileName}
                                    </p>
                                )}
                                    <div className='flex items-center justify-between'>
                                        <button 
                                        onClick={handlePreview}
                                        className='font-medium text-[14px]/[20px] text-[#1B3C4A] cursor-pointer'>View</button>
                                        <button 
                                        // onClick={handlePreview}
                                        className='font-medium text-[14px]/[20px] text-[#D20019] cursor-pointer'>Delete</button>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadBox