"use client";

import { useState } from "react";

export default function UploadImageModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  function handleConfirm() {
    if (!file) return;

    // send file to parent (NOT uploaded yet)
    onUpload(file);

    onClose();
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          Upload Image
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:rounded-lg file:border file:border-gray-300 file:px-2 file:py-2"
        />

        {preview && (
          <img
            src={preview}
            className="mt-4 rounded max-h-62.5 object-contain"
            alt="preview"
          />
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleConfirm}
            disabled={!file}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Confirm
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}