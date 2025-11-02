"use client";

import { useState, useMemo } from "react";
import { User, UserFilters } from "@/types/users.types";
import { MOCK_USERS, USERS_PAGINATION } from "@/config/users.config";

export const useUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    department: undefined,
    status: undefined,
  });

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      // Search filter (name or email)
      if (
        filters.search &&
        !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (filters.status && user.status !== filters.status) {
        return false;
      }

      // Department filter
      if (filters.department && user.department !== filters.department) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Pagination logic
  const totalPages = Math.ceil(
    filteredUsers.length / USERS_PAGINATION.ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * USERS_PAGINATION.ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PAGINATION.ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Data
    users: paginatedUsers,
    totalUsers: filteredUsers.length,

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

export default useUsers;
