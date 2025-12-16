"use client";
import { useRef } from "react";
import { Trash2, FileText, Upload, ExternalLink } from "lucide-react";

interface FileUploadProps {
  label?: string;
  file?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  existingFileUrl?: string;
  existingFileName?: string;
  onRemoveExisting?: () => void;
}

export default function FileUpload({
  label = "",
  file,
  onChange,
  accept = ".jpg,.jpeg,.png,.pdf",
  existingFileUrl,
  existingFileName,
  onRemoveExisting,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFile = file || existingFileUrl;
  const fileName = file?.name || existingFileName || "Uploaded Bill";
  const isImage = existingFileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div className="w-full max-w-md">
      <label className="text-base font-semibold text-gray-900 mb-3 block">
        {label}
      </label>
      <div
        className="border-2 border-dashed border-orange-500 rounded-xl p-6"
        onClick={() => !hasFile && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        style={{ cursor: hasFile ? "default" : "pointer" }}
      >
        {!hasFile ? (
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
          <div className="space-y-3">
            {/* Image Preview */}
            {existingFileUrl && isImage && !file && (
              <div className="mb-3">
                <img
                  src={existingFileUrl}
                  alt="Bill preview"
                  className="max-w-full max-h-48 rounded-lg object-contain mx-auto"
                />
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="w-7 h-7 text-orange-500" />
                <span className="text-base font-medium text-gray-800">
                  {fileName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* View link for existing file */}
                {existingFileUrl && !file && (
                  <a
                    href={existingFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View file"
                  >
                    <ExternalLink className="w-6 h-6 text-blue-600 hover:text-blue-700" />
                  </a>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (file) {
                      onChange(null);
                    } else if (onRemoveExisting) {
                      onRemoveExisting();
                    }
                  }}
                  aria-label="Remove file"
                >
                  <Trash2 className="w-6 h-6 text-gray-700 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Replace button */}
            {existingFileUrl && !file && (
              <button
                type="button"
                className="w-full mt-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Replace File
              </button>
            )}

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
          </div>
        )}
      </div>
    </div>
  );
}
