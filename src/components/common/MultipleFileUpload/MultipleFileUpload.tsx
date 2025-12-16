"use client";
import { useRef } from "react";
import { Trash2, FileText, Upload, ImageIcon } from "lucide-react";

interface MultipleFileUploadProps {
  label?: string;
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
}

export default function MultipleFileUpload({
  label = "",
  files,
  onChange,
  accept = ".jpg,.jpeg,.png,.pdf",
  maxFiles = 10,
  maxSizePerFile = 5 * 1024 * 1024, 
}: MultipleFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFileSelect = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);

    // Filter out duplicates based on name and size
    const uniqueNewFiles = filesArray.filter(
      (newFile) =>
        !files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size
        )
    );

    // Check if adding new files would exceed max limit
    if (files.length + uniqueNewFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = uniqueNewFiles.filter(
      (file) => file.size > maxSizePerFile
    );
    if (oversizedFiles.length > 0) {
      alert(
        `The following files exceed ${formatFileSize(maxSizePerFile)}: ${oversizedFiles.map((f) => f.name).join(", ")}`
      );
      return;
    }

    onChange([...files, ...uniqueNewFiles]);

    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const canAddMore = files.length < maxFiles;

  const FilePreview = ({ file }: { file: File }) => {
    if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      return (
        <img
          src={imageUrl}
          alt={file.name}
          className="w-16 h-16 object-cover rounded border border-gray-200"
          onLoad={() => URL.revokeObjectURL(imageUrl)} // Cleanup after load
        />
      );
    }
    return (
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border border-gray-200">
        <FileText className="w-8 h-8 text-red-500" />
      </div>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-base font-semibold text-gray-900 mb-3 block">
          {label}
        </label>
      )}

      {/* Upload Zone - Only show when can add more files */}
      {canAddMore && (
        <div
          className="border-2 border-dashed border-orange-500 rounded-xl p-6 mb-4 cursor-pointer hover:bg-orange-50 transition"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-orange-500 mb-3 pointer-events-none" />
            <span className="bg-orange-500 px-4 py-1 rounded-lg text-white font-medium pointer-events-none">
              {files.length > 0 ? "Add More Files" : "Upload Files"}
            </span>
            <input
              type="file"
              accept={accept}
              multiple
              className="hidden"
              ref={inputRef}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <span className="text-xs text-gray-500 mt-4 pointer-events-none text-center">
              *Files Supported: JPG, PNG & PDF (Max {maxFiles} files, {formatFileSize(maxSizePerFile)} each)
            </span>
          </div>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Selected Files ({files.length}/{maxFiles})
          </div>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="border-2 border-gray-200 rounded-lg p-3 hover:border-orange-300 transition"
            >
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FilePreview file={file} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <Trash2 className="w-5 h-5 text-gray-700 hover:text-red-500 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Max files reached message */}
      {!canAddMore && (
        <p className="text-sm text-orange-600 mt-2">
          Maximum file limit reached ({maxFiles} files)
        </p>
      )}
    </div>
  );
}
