"use client";

import { useState, useMemo } from "react";
import { RoleFilters } from "@/types/roles.types";
import {
  MOCK_ROLES,
  ROLE_STATS,
  ROLES_PAGINATION,
} from "@/config/roles.config";

export const useRoles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<RoleFilters>({
    search: "",
    scope: undefined,
    roleType: undefined,
    status: undefined,
  });

  // Filter roles based on search and filters
  const filteredRoles = useMemo(() => {
    return MOCK_ROLES.filter((role) => {
      // Search filter
      if (
        filters.search &&
        !role.role.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Scope filter
      if (filters.scope && role.scope !== filters.scope) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Pagination logic
  const totalPages = Math.ceil(
    filteredRoles.length / ROLES_PAGINATION.ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ROLES_PAGINATION.ITEMS_PER_PAGE;
  const paginatedRoles = filteredRoles.slice(
    startIndex,
    startIndex + ROLES_PAGINATION.ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<RoleFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Data
    roles: paginatedRoles,
    stats: ROLE_STATS,
    totalRoles: filteredRoles.length,

    // Pagination
    currentPage,
    totalPages,

    // Handlers
    handleSearch,
    handleFilterChange,
    handlePageChange,

    // State
    filters,
  };
};

export default useRoles;
