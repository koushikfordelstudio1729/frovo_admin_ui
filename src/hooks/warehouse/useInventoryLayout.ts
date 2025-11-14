import { useState, useMemo } from "react";
import {
  batchData,
  quarantineData,
  INVENTORY_PAGINATION,
} from "@/config/warehouse/inventory-layout.config";

export interface InventoryFilters {
  ageRange: string;
}

export const useInventoryLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<InventoryFilters>({ ageRange: "" });

  // Filter logic for age ranges
  const filteredRows = useMemo(() => {
    return batchData.filter((row: { age: number }) => {
      if (!filters.ageRange) return true;
      if (filters.ageRange === "0-15") return row.age <= 15;
      if (filters.ageRange === "16-45") return row.age > 15 && row.age <= 45;
      if (filters.ageRange === "46+") return row.age > 45;
      return true;
    });
  }, [filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / INVENTORY_PAGINATION.ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * INVENTORY_PAGINATION.ITEMS_PER_PAGE;
  const paginatedRows = filteredRows.slice(
    startIndex,
    startIndex + INVENTORY_PAGINATION.ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleFilterChange = (ageRange: string) => {
    setFilters({ ageRange });
    setCurrentPage(1);
  };

  return {
    rows: paginatedRows,
    currentPage,
    totalPages,
    handlePageChange,
    filters,
    handleFilterChange,
    expirySoon: quarantineData.length > 0 ? quarantineData[0] : null,
    quarantineData,
  };
};
