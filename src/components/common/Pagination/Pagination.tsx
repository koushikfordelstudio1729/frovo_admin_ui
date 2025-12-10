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
  const createPageButtons = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = createPageButtons();

  return (
    <div className="flex items-center justify-center px-6 py-8 bg-gray-50">
      <div className="flex items-center gap-2">
        {/* FIRST */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm rounded border-2 ${
            currentPage === 1
              ? "text-gray-400  border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100"
          }`}
        >
          {"<< First"}
        </button>

        {/* BACK */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm rounded border-2 ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100"
          }`}
        >
          {"< Back"}
        </button>

        {/* PAGE NUMBERS */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={`px-3 py-2 text-sm rounded font-medium transition ${
                currentPage === page
                  ? "bg-gray-900 text-white border-2 border-gray-900" // ACTIVE PAGE
                  : "border-2 border-gray-400 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm rounded border-2 ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100"
          }`}
        >
          {"Next >"}
        </button>

        {/* LAST */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm rounded border-2 ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100"
          }`}
        >
          {"Last >>"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
