"use client";

import { useState, useMemo } from "react";
import { RoleList, RoleFilters } from "@/types/roles.types";
import { ROLE_STATS, ROLES_PAGINATION } from "@/config/roles.config";

// Mock data 
const MOCK_ROLES: RoleList[] = [
  {
    id: 1,
    role: "Super Admin",
    description: "Full system access and control",
    scope: "Global",
    user: "Sankalp",
    lastModified: "22-10-2025",
  },
  {
    id: 2,
    role: "Ops Manager",
    description: "Manages operations and refills",
    scope: "Global",
    user: "Koushik",
    lastModified: "21-10-2025",
  },
  {
    id: 3,
    role: "Field Agent",
    description: "Executes refills and submits proof",
    scope: "Machine",
    user: "Jatin",
    lastModified: "20-10-2025",
  },
  {
    id: 4,
    role: "Technician",
    description: "Handles breakdowns and alerts",
    scope: "Machine",
    user: "Nithin",
    lastModified: "19-10-2025",
  },
  {
    id: 5,
    role: "Finance Manager",
    description: "Manages reconciliation and payouts",
    scope: "Global",
    user: "Sankalp",
    lastModified: "18-10-2025",
  },
  {
    id: 6,
    role: "Support Agent",
    description: "Handles refunds and escalations",
    scope: "Global",
    user: "Koushik",
    lastModified: "17-10-2025",
  },
  {
    id: 7,
    role: "Warehouse Manager",
    description: "Manages stock and logistics",
    scope: "Partner",
    user: "Jatin",
    lastModified: "16-10-2025",
  },
  {
    id: 8,
    role: "Auditor",
    description: "Read-only reporting access",
    scope: "Global",
    user: "Nithin",
    lastModified: "15-10-2025",
  },
  {
    id: 9,
    role: "Ops Manager",
    description: "Manages operations and refills",
    scope: "Partner",
    user: "Sankalp",
    lastModified: "14-10-2025",
  },
  {
    id: 10,
    role: "Field Agent",
    description: "Executes refills and submits proof",
    scope: "Global",
    user: "Koushik",
    lastModified: "13-10-2025",
  },
  {
    id: 11,
    role: "Technician",
    description: "Handles breakdowns and alerts",
    scope: "Partner",
    user: "Jatin",
    lastModified: "12-10-2025",
  },
];


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
