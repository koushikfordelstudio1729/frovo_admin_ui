"use client";

import { RoleFilters } from "@/types/roles.types";
import { Plus, Search, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../common";

interface RoleTableHeadProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Partial<RoleFilters>) => void;
}

export const RoleTableHeader: React.FC<RoleTableHeadProps> = ({
  onSearch,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    scope: "All",
    roleType: "All",
    status: "All",
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value,
    };
    setSelectedFilters(newFilters);

    // Type-safe filter change
    const update: Partial<RoleFilters> = {};
    if (value !== "All") {
      if (filterType === "scope") {
        update.scope = value as "Global" | "Partner" | "Machine";
      }
      if (filterType === "roleType") {
        update.roleType = value as "System" | "Custom";
      }
      if (filterType === "status") {
        update.status = value as "Active" | "Inactive";
      }
    }

    onFilterChange(update);
    setOpenDropdown(null);
  };

  const scopes = ["All", "Global", "Machine", "Partner"];
  const roleTypes = [
    "All",
    "Super Admin",
    "Ops Manager",
    "Field Agent",
    "Technician",
    "Finance Manager",
    "Support Agent",
    "Warehouse Manager",
    "Auditor",
  ];
  const statuses = ["All", "Active", "Inactive"];

  return (
    <div className="mb-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Role's List</h2>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={20}
            className="absolute left-3 top-1/2 text-gray-400 transform -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search Name"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-600"
          />
        </div>

        {/* Scope Dropdown */}
        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "scope" ? null : "scope")
            }
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[120px]"
          >
            Scope: {selectedFilters.scope}
            <ChevronDown size={18} />
          </button>
          {openDropdown === "scope" && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
              {scopes.map((scope) => (
                <button
                  key={scope}
                  onClick={() => handleFilterSelect("scope", scope)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedFilters.scope === scope
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Type Dropdown */}
        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "roleType" ? null : "roleType")
            }
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[140px]"
          >
            Type: {selectedFilters.roleType}
            <ChevronDown size={18} />
          </button>
          {openDropdown === "roleType" && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px] max-h-[300px] overflow-y-auto">
              {roleTypes.map((role) => (
                <button
                  key={role}
                  onClick={() => handleFilterSelect("roleType", role)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedFilters.roleType === role
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "status" ? null : "status")
            }
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[130px]"
          >
            Status: {selectedFilters.status}
            <ChevronDown size={18} />
          </button>
          {openDropdown === "status" && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[150px]">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterSelect("status", status)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedFilters.status === status
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Button */}
        <Button
          variant="primary"
          size="md"
          className="ml-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
        >
          <Plus size={18} />
          Add new role
        </Button>
      </div>
    </div>
  );
};

export default RoleTableHeader;
