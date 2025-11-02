"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

interface TableNameProps {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  buttonText: string;
  buttonLink: string;
  showSearch?: boolean;
}

export const TableName: React.FC<TableNameProps> = ({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  buttonText,
  buttonLink,
  showSearch = true,
}) => {
  return (
    <>
      {/* Title + Button when no searchbar */}
      {!showSearch && (
        <div className="flex items-center justify-between mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <Link
            href={buttonLink}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium whitespace-nowrap"
          >
            <Plus size={20} />
            {buttonText}
          </Link>
        </div>
      )}

      {/* Title only when searchbar exist) */}
      {showSearch && (
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      )}

      {/* Search + Button only when searchbar exist */}
      {showSearch && (
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-sm pl-10 pr-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <Link
            href={buttonLink}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium whitespace-nowrap"
          >
            <Plus size={20} />
            {buttonText}
          </Link>
        </div>
      )}
    </>
  );
};

export default TableName;
