"use client";

import React from "react";
import RoleStatsGrid from "@/components/roles-permissions/RoleStatsGrid";
import RoleTableHeader from "@/components/roles-permissions/RoleTableHeader";
import RolesDataTable from "@/components/roles-permissions/RolesDataTable";
import { useRoles } from "@/hooks/admin/useRoles";
import { ROLE_STATS } from "@/config/admin/roles.config";

export default function RolesPermissionsPage() {
  const {
    roles,
    currentPage,
    totalPages,
    totalRoles,
    handleSearch,
    handleFilterChange,
    handlePageChange,
  } = useRoles();

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <RoleStatsGrid stats={ROLE_STATS} />

      {/* Table Header */}
      <RoleTableHeader
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {/* Data Table */}
      <RolesDataTable
        roles={roles}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalRoles}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
