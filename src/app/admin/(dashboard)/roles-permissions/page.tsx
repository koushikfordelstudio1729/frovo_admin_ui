"use client";

import RoleStatsGrid from "@/components/roles-permissions/RoleStatsGrid";
import RoleTableHeader from "@/components/roles-permissions/RoleTableHeader";
import RolesDataTable from "@/components/roles-permissions/RolesDataTable";
import { useRoles } from "@/hooks/useRoles";

export default function RolesPermissionsPage() {
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

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <RoleStatsGrid stats={stats} />

      {/* Table Header */}
      <RoleTableHeader
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      )}

      {/* Error State */}
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

      {/* Data Table */}
      {!isLoading && !error && (
        <RolesDataTable
          roles={roles}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalRoles}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
