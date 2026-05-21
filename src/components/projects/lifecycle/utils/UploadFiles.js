const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            if (img.width <= 800 && img.height <= 400) {
            resolve(true);
            } else {
            resolve(false);
            }
        };

        img.src = url;
    });
};

// Validate and process file
const processFile = async (file) => {
    if(!file) return

    // ❌ Type validation
    if (!allowedTypes.includes(file.type)) {
        setError("Only SVG, JPG, or GIF allowed");
        return;
    }

    // Size Validation
    if(file.size > maxSizeMB * 1024 * 1024) {
        setError(`Max file size is ${maxSizeMB}MB`)
        return
    }

    // ❌ Dimension validation
    const isValidSize = await validateImageDimensions(file);
    
    if (!isValidSize) {
        setError("Image must be max 800x400px");
        return;
    }

    setError("")
    setFileName(file.name)
    setPreview(URL.createObjectURL(file))

    onFileSelect?.(URL.createObjectURL(file))
}

// Handle input change
const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log(file)
    setIsUploaded(true)
    processFile(file)
}

// Drag events
const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
};

const handleDragLeave = () => {
    setIsDragging(false);
};

const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    processFile(file);
};

export {
    validateImageDimensions,
    processFile,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop
}
