"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, Input } from "@/components/common";

interface TableNameProps {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  buttonText: string;
  buttonLink: string;
  showSearch?: boolean;
  onButtonClick?: () => void;
}

export const TableName: React.FC<TableNameProps> = ({
  title,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  buttonText,
  buttonLink,
  showSearch = true,
  onButtonClick,
}) => {
  // Render button component
  const renderButton = () => {
    const buttonContent = (
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={onButtonClick}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        <Plus size={20} />
        {buttonText}
      </Button>
    );

    // If onButtonClick is provided, use it; otherwise wrap in Link
    if (onButtonClick) {
      return buttonContent;
    }

    return <Link href={buttonLink}>{buttonContent}</Link>;
  };

  return (
    <>
      {/* Layout: Title + Button (when no search) */}
      {!showSearch && (
        <div className="flex items-center justify-between mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {renderButton()}
        </div>
      )}

      {/* Layout: Title + Search + Button (when search exists) */}
      {showSearch && (
        <>
          {/* Title */}
          <div className="mb-4 mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center justify-between gap-4 mb-8">
            {/* Search Input*/}
            <div className="flex-1 max-w-md">
              <Input
                variant="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                startIcon={<Search size={20} />}
              />
            </div>

            {/* Button */}
            {renderButton()}
          </div>
        </>
      )}
    </>
  );
};

export default TableName;
