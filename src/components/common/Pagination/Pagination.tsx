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
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Calculate the range of pages to show
    let startPage: number;
    let endPage: number;

    if (currentPage <= 3) {
      // Near the start
      startPage = 2;
      endPage = maxVisible;
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push("...");
      startPage = totalPages - maxVisible + 1;
      endPage = totalPages - 1;
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      pages.push(totalPages);
    } else {
      // In the middle
      pages.push("...");
      startPage = currentPage - 1;
      endPage = currentPage + 1;
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
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
          className={`px-3 py-2 text-sm rounded border-2 ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
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
        {pages.map((page, idx) => {
          const key = `page-${idx}`;

          if (page === "...") {
            return (
              <span
                key={key}
                className="px-3 py-2 text-sm text-gray-500 select-none"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={key}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 text-sm rounded font-medium transition ${
                currentPage === page
                  ? "bg-gray-900 text-white border-2 border-gray-900"
                  : "border-2 border-gray-400 text-gray-700 hover:bg-gray-100"
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
