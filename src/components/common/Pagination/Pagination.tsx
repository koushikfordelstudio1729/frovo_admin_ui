"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-center px-6 py-8 bg-gray-50">
      <div className="flex items-center gap-2">
        {/* First Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {"<< First"}
        </button>

        {/* Back Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {"< Back"}
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-2 text-sm rounded ${
              currentPage === i + 1
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-900 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {"Next >"}
        </button>

        {/* Last Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {"Last >>"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
