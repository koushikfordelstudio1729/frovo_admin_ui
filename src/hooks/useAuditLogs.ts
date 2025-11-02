"use client";

import { useState, useMemo } from "react";
import { AuditLogFilters } from "@/types/audit-logs.types";
import {
  MOCK_AUDIT_LOGS,
  AUDIT_LOGS_PAGINATION,
} from "@/config/audit-logs.config";

export const useAuditLogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: "",
  });

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      if (
        filters.search &&
        !log.actor.toLowerCase().includes(filters.search.toLowerCase()) &&
        !log.target.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(
    filteredLogs.length / AUDIT_LOGS_PAGINATION.ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * AUDIT_LOGS_PAGINATION.ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + AUDIT_LOGS_PAGINATION.ITEMS_PER_PAGE
  );

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    logs: paginatedLogs,
    totalLogs: filteredLogs.length,
    currentPage,
    totalPages,
    handleSearch,
    handlePageChange,
    filters,
  };
};

export default useAuditLogs;
