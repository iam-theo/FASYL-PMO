import React from "react";

function StageFileUpload({
  documents = [],
  stageData,
  project,
  preview,
  setPreview
}) {
  if (!documents.length) {
    return (
      <p className="text-sm text-gray-500">
        No documents required for this stage.
      </p>
    );
  }

  /**
   * Get uploaded file for a document
   */
  const getFile = (docKey) => {
    return stageData?.documents?.find(
      (d) => d.key === docKey
    );
  };

  /**
   * Handle file upload (mocked for now)
   * In real system: send to API / S3 / Cloudinary
   */
  const handleUpload = (docKey, file) => {
    console.log("Uploading file:", docKey, file);

    // TODO: replace with API call
    // update project state externally via engine if needed
  };

  return (
    <div className="flex flex-col gap-3">

      {documents.map((doc, index) => {
        const uploaded = getFile(doc.key);

        return (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-[#0000000D] bg-[#F3F3F3]"
          >

            {/* LEFT SIDE */}
            <div className="flex flex-col gap-1">

              <p className="font-medium text-sm text-[#090909]">
                {doc.label}
              </p>

              {doc.description && (
                <p className="text-xs text-gray-500">
                  {doc.description}
                </p>
              )}

              {/* STATUS */}
              <p
                className={`text-xs mt-1 ${
                  uploaded?.fileUrl
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {uploaded?.fileUrl
                  ? "Uploaded"
                  : "Pending upload"}
              </p>

            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-2">

              {/* VIEW FILE */}
              {uploaded?.fileUrl && (
                <button
                  onClick={() => setPreview(uploaded.fileUrl)}
                  className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Preview
                </button>
              )}

              {/* UPLOAD INPUT */}
              <label className="text-xs px-3 py-1 rounded-md bg-[#1B3C4A] text-white cursor-pointer hover:opacity-90">

                Upload

                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleUpload(doc.key, e.target.files[0])
                  }
                />
              </label>

            </div>

          </div>
        );
      })}

      {/* =========================
          GLOBAL PREVIEW MODAL
      ========================== */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <img
              src={preview}
              alt="preview"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default StageFileUpload;