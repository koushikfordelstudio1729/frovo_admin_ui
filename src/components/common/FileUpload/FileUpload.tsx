// components/FileUpload.tsx
"use client";
import { useRef } from "react";
import { Trash2, FileText, Upload } from "lucide-react";

interface FileUploadProps {
  label?: string;
  file?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

export default function FileUpload({
  label = "",
  file,
  onChange,
  accept = ".jpg,.jpeg,.png,.pdf",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-md">
      <label className="text-base font-semibold text-gray-900 mb-3 block">
        {label}
      </label>
      <div
        className="border-2 border-dashed border-orange-500 rounded-xl p-6"
        onClick={() => !file && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        style={{ cursor: file ? "default" : "pointer" }}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-orange-500 mb-3 pointer-events-none" />
            <span className="bg-orange-500 px-4 py-1 rounded-lg text-white font-medium pointer-events-none">
              Upload
            </span>
            <input
              type="file"
              accept={accept}
              className="hidden"
              ref={inputRef}
              onChange={(e) =>
                onChange(
                  e.target.files && e.target.files.length > 0
                    ? e.target.files[0]
                    : null
                )
              }
            />
            <span className="text-xs text-gray-500 mt-4 pointer-events-none">
              *File Supported .JPG, .PNG & .PDF
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FileText className="w-7 h-7 text-orange-500" />
              <span className="text-base font-medium text-gray-800">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              className="ml-4"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              aria-label="Remove file"
            >
              <Trash2 className="w-6 h-6 text-gray-700 hover:text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
