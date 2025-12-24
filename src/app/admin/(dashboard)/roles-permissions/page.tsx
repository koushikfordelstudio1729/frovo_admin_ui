"use client";

import React, { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoles } from "@/hooks/admin/useRoles";
import { RoleList, RoleFilters } from "@/types/roles.types";
import {
  Badge,
  Button,
  Pagination,
  Table,
  Input,
  Dropdown,
  ConfirmDialog,
} from "@/components";
import StatCard from "@/components/common/StatCard";
import { Column } from "@/components/name&table/Table";
import {
  Eye,
  Trash2,
  Plus,
  Search,
  Shield,
  Briefcase,
  Wrench,
  DollarSign,
  Headphones,
  Warehouse,
  ClipboardCheck,
  ShieldAlert,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  shield: Shield,
  briefcase: Briefcase,
  wrench: Wrench,
  "dollar-sign": DollarSign,
  headphones: Headphones,
  warehouse: Warehouse,
  "clipboard-check": ClipboardCheck,
  "shield-alert": ShieldAlert,
};

export default function RolesPermissionsPage() {
  const router = useRouter();

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleList | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Hooks
  const {
    roles,
    stats,
    currentPage,
    totalPages,
    totalRoles,
    isLoading,
    error,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  } = useRoles();

  // Local State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    scope: "All",
    roleType: "All",
    status: "All",
  });

  // Filter Options
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

  // Table Configuration
  const columns: Column[] = [
    { key: "role", label: "Role", minWidth: "150px" },
    { key: "description", label: "Description", minWidth: "250px" },
    { key: "scope", label: "Scope", minWidth: "120px" },
    { key: "user", label: "Users", minWidth: "100px" },
    { key: "lastModified", label: "Last Modification", minWidth: "180px" },
    { key: "actions", label: "Action", minWidth: "120px" },
  ];

  // Event Handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleSearch(value);
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
        update.role = value;
      }
      if (filterType === "status") {
        update.status = value as "Active" | "Inactive";
      }
    } else {
      if (filterType === "roleType") {
        update.role = undefined;
      }
    }

    handleFilterChange(update);
  };

  const handleViewRole = (role: RoleList) => {
    router.push(`/admin/roles-permissions/view-role?id=${role.id}`);
  };

  const handleDeleteRole = (role: RoleList) => {
    setRoleToDelete(role);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      setDeleteLoading(true);
      // TODO: call your delete API / mutation here with roleToDelete.id
      console.log("Deleting role:", roleToDelete.id);
      // after success, you might want to refetch roles list
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteOpen(false);
    setRoleToDelete(null);
  };
  // Cell Rendering
  const renderCell = (
    key: string,
    value: unknown,
    row?: Record<string, unknown>
  ): ReactNode => {
    if (key === "scope") {
      return <Badge label={value as string} size="md" variant="active" />;
    }

    if (key === "actions" && row) {
      const role = row as unknown as RoleList;

      return (
        <div className="flex items-center justify-center gap-3">
          <Button
            title="View"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleViewRole(role)}
          >
            <Eye className="text-green-500 w-5 h-5" />
          </Button>
          <Button
            title="Delete"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleDeleteRole(role)}
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </Button>
        </div>
      );
    }

    return value as ReactNode;
  };

  return (
    <div className="min-h-screen pt-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon] || Shield;
          return (
            <StatCard
              key={stat.id}
              title={stat.name}
              count={stat.count}
              icon={Icon}
            />
          );
        })}
      </div>

      <div className="mb-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Role&apos;s List
        </h2>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-sm">
            <Input
              variant="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
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

      {isLoading && (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent" />
            <p className="mt-4 text-gray-600">Loading roles...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table
            columns={columns}
            data={roles}
            renderCell={renderCell}
            enableHorizontalScroll={true}
            minTableWidth="1400px"
            showSeparators
            alternateRowColors
          />

          {roles.length === 0 && (
            <div className="text-center py-12 bg-gray-50">
              <p className="text-gray-500 text-lg">No roles found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete role?"
        message={
          roleToDelete ? (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {roleToDelete.role}
              </span>
              ? This action cannot be undone.
            </span>
          ) : (
            ""
          )
        }
        confirmText="Yes, delete"
        cancelText="No"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
}
