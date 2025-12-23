"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArchiveRestore, Package } from "lucide-react";
import {
  Button,
  Table,
  Badge,
  Pagination,
  BackHeader,
  StatCard,
} from "@/components";
import { useMyWarehouse } from "@/hooks/warehouse";
import { warehouseAPI } from "@/services/warehouseAPI";
import type { InventoryItem } from "@/types";
import { toast } from "react-hot-toast";

const archivedColumns = [
  { key: "select", label: "" },
  { key: "batchId", label: "Batch ID" },
  { key: "sku", label: "SKU" },
  { key: "productName", label: "Product Name" },
  { key: "quantity", label: "Quantity" },
  { key: "age", label: "Age (Days)" },
  { key: "status", label: "Status" },
  { key: "archivedAt", label: "Archived At" },
  { key: "actions", label: "Actions" },
];

export default function ArchivePage() {
  const router = useRouter();

  // Get warehouse info
  const { warehouse, loading: warehouseLoading } = useMyWarehouse();

  // State
  const [archivedItems, setArchivedItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unarchiving, setUnarchiving] = useState(false);

  // Selection state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "unarchive" | "bulk_unarchive" | null;
    item: InventoryItem | null;
    count?: number;
  }>({
    isOpen: false,
    type: null,
    item: null,
  });

  // Fetch archived inventory
  const fetchArchivedInventory = useCallback(async () => {
    if (!warehouse?._id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await warehouseAPI.getArchivedInventory(warehouse._id, {
        page,
        limit: 10,
      });

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setArchivedItems(apiResponse.data.inventory);
        setTotal(apiResponse.data.total);
        setPage(apiResponse.data.page);
        setTotalPages(apiResponse.data.totalPages);
      } else {
        setError(apiResponse.message || "Failed to fetch archived inventory");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch archived inventory";
      setError(errorMessage);
      console.error("Error fetching archived inventory:", err);
    } finally {
      setLoading(false);
    }
  }, [warehouse?._id, page]);

  // Initial fetch
  useEffect(() => {
    if (warehouse?._id) {
      fetchArchivedInventory();
    }
  }, [warehouse?._id, page]);

  // Handle unarchive
  const handleUnarchiveClick = (item: InventoryItem) => {
    setConfirmDialog({
      isOpen: true,
      type: "unarchive",
      item,
    });
  };

  // Selection handlers
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === archivedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(archivedItems.map((item) => item._id));
    }
  };

  const isAllSelected =
    archivedItems.length > 0 && selectedItems.length === archivedItems.length;
  const isSomeSelected = selectedItems.length > 0 && !isAllSelected;

  // Handle bulk unarchive
  const handleBulkUnarchive = () => {
    if (selectedItems.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      type: "bulk_unarchive",
      item: null,
      count: selectedItems.length,
    });
  };

  // Confirm unarchive
  const handleConfirmUnarchive = async () => {
    if (!confirmDialog.type) return;

    try {
      setUnarchiving(true);
      let success = false;

      if (confirmDialog.type === "unarchive" && confirmDialog.item) {
        const response = await warehouseAPI.unarchiveInventoryItem(
          confirmDialog.item._id
        );
        const apiResponse = response.data;
        if (apiResponse.success) {
          toast.success(apiResponse.message || "Item unarchived successfully");
          success = true;
        } else {
          toast.error(apiResponse.message || "Failed to unarchive item");
        }
      } else if (confirmDialog.type === "bulk_unarchive") {
        const response = await warehouseAPI.bulkUnarchiveInventory({
          inventoryIds: selectedItems,
        });
        const apiResponse = response.data;
        if (apiResponse.success) {
          toast.success(
            apiResponse.message ||
              `${selectedItems.length} items unarchived successfully`
          );
          success = true;
        } else {
          toast.error(apiResponse.message || "Failed to unarchive items");
        }
      }

      if (success) {
        setConfirmDialog({ isOpen: false, type: null, item: null });
        setSelectedItems([]);
        fetchArchivedInventory();
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to unarchive";
      toast.error(errorMessage);
      console.error("Error unarchiving:", err);
    } finally {
      setUnarchiving(false);
    }
  };

  // Cancel confirmation
  const handleCancelConfirm = () => {
    setConfirmDialog({ isOpen: false, type: null, item: null });
  };

  // Transform data for table
  const tableData = useMemo(() => {
    return archivedItems.map((item) => ({
      batchId: item.batchId,
      sku: item.sku,
      productName: item.productName,
      quantity: item.quantity,
      age: item.age,
      status: item.status,
      archivedAt: item.archivedAt
        ? new Date(item.archivedAt).toLocaleDateString()
        : "N/A",
      _id: item._id,
      _rawData: item,
    }));
  }, [archivedItems]);

  // Render cell
  const renderCell = (
    key: string,
    value: unknown,
    row?: Record<string, unknown>
  ) => {
    if (key === "select") {
      const item = row?._rawData as InventoryItem;
      return (
        <input
          type="checkbox"
          checked={selectedItems.includes(item._id)}
          onChange={() => handleSelectItem(item._id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
        />
      );
    }

    if (key === "status") {
      const statusValue = value as string;

      let variant: "approved" | "warning" | "rejected" = "approved";
      if (statusValue === "low_stock") variant = "warning";
      if (statusValue === "out_of_stock") variant = "rejected";

      const label = statusValue
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return (
        <Badge
          variant={variant}
          label={label}
          size="md"
          showDot={true}
          className="px-3 py-1 text-sm rounded-full"
        />
      );
    }

    if (key === "age") {
      const ageValue = value as number;
      let variant: "approved" | "warning" | "rejected" = "approved";
      if (ageValue <= 15) variant = "rejected";
      else if (ageValue <= 45) variant = "warning";

      return (
        <Badge
          variant={variant}
          label={`${ageValue} Days`}
          size="md"
          className="px-3 py-1 text-sm rounded-full"
        />
      );
    }

    if (key === "actions") {
      const item = row?._rawData as InventoryItem;
      return (
        <div className="flex items-center gap-2">
          <Button
            title="Unarchive"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleUnarchiveClick(item)}
          >
            <ArchiveRestore className="text-green-500 w-5 h-5" />
          </Button>
        </div>
      );
    }

    return value as React.ReactNode;
  };

  if (warehouseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading warehouse...</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            <strong>Error:</strong> No warehouse assigned to your account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <BackHeader title={`Archived Inventory -  ${warehouse.name}`} />

      {/* Stats */}
      <div className="mb-4 max-w-72">
        {!loading && (
          <StatCard
            title=" Total Archived Items"
            count={total}
            icon={Package}
          />
        )}
      </div>

      {/* Selection Bar */}
      {!loading && !error && archivedItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isSomeSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({archivedItems.length})
                </span>
              </label>
              {selectedItems.length > 0 && (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-sm font-semibold text-blue-900">
                    {selectedItems.length} item
                    {selectedItems.length !== 1 ? "s" : ""} selected
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => setSelectedItems([])}
                  >
                    Clear Selection
                  </Button>
                </>
              )}
            </div>
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-lg"
                  onClick={handleBulkUnarchive}
                  disabled={unarchiving}
                >
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Unarchive Selected ({selectedItems.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading archived inventory...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[1400px]">
              <Table
                columns={archivedColumns}
                data={tableData}
                renderCell={renderCell}
              />
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {/* Empty State */}
          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No archived items found</p>
              <Button
                variant="primary"
                size="md"
                className="rounded-lg mt-4"
                onClick={() => router.push("/warehouse/inventory-layout")}
              >
                Go to Active Inventory
              </Button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <ArchiveRestore className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {confirmDialog.type === "unarchive" &&
                  "Unarchive Inventory Item?"}
                {confirmDialog.type === "bulk_unarchive" &&
                  `Unarchive ${confirmDialog.count} Items?`}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {confirmDialog.type === "unarchive" &&
                  confirmDialog.item &&
                  `Are you sure you want to unarchive ${confirmDialog.item.productName} (${confirmDialog.item.sku})? This will restore it to the active inventory.`}
                {confirmDialog.type === "bulk_unarchive" &&
                  `Are you sure you want to unarchive ${confirmDialog.count} selected items? This will restore them to the active inventory.`}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="md"
                  className="rounded-lg"
                  onClick={handleCancelConfirm}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="rounded-lg"
                  onClick={handleConfirmUnarchive}
                  disabled={unarchiving}
                >
                  {unarchiving ? "Unarchiving..." : "Unarchive"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
