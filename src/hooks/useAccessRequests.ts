"use client";

import { useState, useMemo } from "react";
import {
  AccessRequest,
  AccessRequestFilters,
} from "@/types/access-requests.types";
import {
  MOCK_ACCESS_REQUESTS,
  ACCESS_REQUESTS_PAGINATION,
} from "@/config/access-requests.config";

export const useAccessRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AccessRequestFilters>({
    search: "",
    status: undefined,
  });

  const filteredRequests = useMemo(() => {
    return MOCK_ACCESS_REQUESTS.filter((request) => {
      if (
        filters.search &&
        !request.requester
          .toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        !request.permission.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (filters.status && request.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(
    filteredRequests.length / ACCESS_REQUESTS_PAGINATION.ITEMS_PER_PAGE
  );
  const startIndex =
    (currentPage - 1) * ACCESS_REQUESTS_PAGINATION.ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + ACCESS_REQUESTS_PAGINATION.ITEMS_PER_PAGE
  );

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AccessRequestFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    requests: paginatedRequests,
    totalRequests: filteredRequests.length,
    currentPage,
    totalPages,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    filters,
  };
};

export default useAccessRequests;
