"use client";

import { RoleFilters } from "@/types/roles.types";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { Button, Input, Dropdown } from "@/components/common";
import { useRouter } from "next/navigation";

interface RoleTableHeadProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Partial<RoleFilters>) => void;
}

export const RoleTableHeader: React.FC<RoleTableHeadProps> = ({
  onSearch,
  onFilterChange,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
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
  };

  const scopeOptions = [
    { value: "All", label: "All" },
    { value: "Global", label: "Global" },
    { value: "Machine", label: "Machine" },
    { value: "Partner", label: "Partner" },
  ];

  const roleTypeOptions = [
    { value: "All", label: "All" },
    { value: "Super Admin", label: "Super Admin" },
    { value: "Ops Manager", label: "Ops Manager" },
    { value: "Field Agent", label: "Field Agent" },
    { value: "Technician", label: "Technician" },
    { value: "Finance Manager", label: "Finance Manager" },
    { value: "Support Agent", label: "Support Agent" },
    { value: "Warehouse Manager", label: "Warehouse Manager" },
    { value: "Auditor", label: "Auditor" },
  ];

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="mb-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Role's List</h2>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        {/* Search Bar   */}
        <div className="flex-1 max-w-sm">
          <Input
            variant="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Role"
            startIcon={<Search size={20} />}
          />
        </div>

        {/* Scope Dropdown */}
        <Dropdown
          label="Scope"
          options={scopeOptions}
          value={selectedFilters.scope}
          onChange={(value) => handleFilterSelect("scope", value)}
        />

        {/* Role Type Dropdown */}
        <Dropdown
          label="Type"
          options={roleTypeOptions}
          value={selectedFilters.roleType}
          onChange={(value) => handleFilterSelect("roleType", value)}
          className="min-w-[140px]"
        />

        {/* Status Dropdown */}
        <Dropdown
          label="Status"
          options={statusOptions}
          value={selectedFilters.status}
          onChange={(value) => handleFilterSelect("status", value)}
        />

        {/* Add Button */}
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => router.push("/admin/create-role")}
          className="ml-auto flex items-center gap-2 rounded-lg"
        >
          <Plus size={18} />
          Add new role
        </Button>
      </div>
    </div>
  );
};

export default RoleTableHeader;
