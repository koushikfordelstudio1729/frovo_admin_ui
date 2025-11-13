import { useState, useMemo } from "react";
import { MOCK_RETURN_QUEUE, RETURN_QUEUE_PAGINATION } from "@/config/warehouse";

export interface ReturnQueueFilters {
  search: string;
  status?: string;
}

export const useReturnQueue = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ReturnQueueFilters>({
    search: "",
    status: undefined,
  });

  // Filtered rows: by search and/or status
  const filteredRows = useMemo(() => {
    return MOCK_RETURN_QUEUE.filter((row) => {
      const matchesSearch =
        !filters.search ||
        row.batchId.toLowerCase().includes(filters.search.toLowerCase()) ||
        row.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
        row.reason.toLowerCase().includes(filters.search.toLowerCase());
      if (!matchesSearch) return false;
      if (filters.status && row.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(
    filteredRows.length / RETURN_QUEUE_PAGINATION.ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * RETURN_QUEUE_PAGINATION.ITEMS_PER_PAGE;
  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + RETURN_QUEUE_PAGINATION.ITEMS_PER_PAGE
  );


  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<ReturnQueueFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    rows: paginatedRows,
    totalRows: filteredRows.length,
    currentPage,
    totalPages,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    filters,
  };
};

export default useReturnQueue;
