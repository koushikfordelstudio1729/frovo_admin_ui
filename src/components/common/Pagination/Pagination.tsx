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
    const pages: (number | "...")[] = [];
    const maxVisible = 3;

    if (totalPages <= maxVisible + 1) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first 3 pages
    if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
    // Show current page and neighbors when in middle
    else if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }
    // Show last 3 pages
    else {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    }

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
          className={`px-3 py-2 text-sm rounded border-2 transition-colors  ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          {"<< First"}
        </button>

        {/* BACK */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm rounded border-2 transition-colors ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          {"< Back"}
        </button>

        {/* PAGE NUMBERS */}
        {pages.map((page, idx) => {
          const key = `page-${idx}`;

          if (page === "...") {
            return (
              <span
                key={key}
                className="px-3 py-2 text-sm text-gray-500 select-none "
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={key}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 text-sm rounded font-medium transition-colors ${
                currentPage === page
                  ? "bg-gray-900 text-white border-2 border-gray-900"
                  : "border-2 border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm rounded border-2 transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          {"Next >"}
        </button>

        {/* LAST */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm rounded border-2 transition-colors ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
              : "text-gray-700 border-gray-400 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          {"Last >>"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
