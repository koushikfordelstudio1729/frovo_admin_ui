"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileArchiveIcon,
  ArrowDownToLine,
  Edit as EditIcon,
  Archive,
  ArchiveRestore,
  X,
  CheckCircle,
  AlertCircle,
  Package,
  TrendingDown,
  Eye,
} from "lucide-react";
import {
  Button,
  Label,
  Table,
  Badge,
  Pagination,
  Select,
  Input,
  Drawer,
  StatCard,
  BackHeader,
} from "@/components";
import { useMyWarehouse } from "@/hooks/warehouse";
import { useInventoryLayout } from "@/hooks/warehouse/useInventoryLayout";
import type { InventoryItem, UpdateInventoryItemPayload } from "@/types";

const inventoryColumns = [
  { key: "select", label: "" },
  { key: "batchId", label: "Batch ID" },
  { key: "sku", label: "SKU" },
  { key: "productName", label: "Product Name" },
  { key: "quantity", label: "Quantity" },
  { key: "age", label: "Age (Days)" },
  { key: "status", label: "Status" },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "location", label: "Location" },
  { key: "actions", label: "Actions" },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

const expiryStatusOptions = [
  { label: "All", value: "" },
  { label: "Normal", value: "normal" },
  { label: "Expiring Soon", value: "expiring_soon" },
  { label: "Expired", value: "expired" },
];

export default function InventoryLayoutPage() {
  const router = useRouter();

  // Get warehouse info
  const { warehouse, loading: warehouseLoading } = useMyWarehouse();

  // Inventory hook
  const {
    inventory,
    stats,
    page,
    totalPages,
    loading,
    statsLoading,
    updating,
    archiving,
    error,
    refetch,
    updateInventoryItem,
    archiveItem,
    unarchiveItem,
    bulkArchive,
    bulkUnarchive,
    setPage,
  } = useInventoryLayout(warehouse?._id || "");

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [expiryStatusFilter, setExpiryStatusFilter] = useState("");
  const [skuFilter, setSkuFilter] = useState("");
  const [batchIdFilter, setBatchIdFilter] = useState("");

  // Selection state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Applied filters (for badges)
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    expiryStatus: "",
    sku: "",
    batchId: "",
  });

  // Edit drawer state
  const [editDrawer, setEditDrawer] = useState<{
    isOpen: boolean;
    item: InventoryItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  // View modal state
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    item: InventoryItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const [editFormData, setEditFormData] = useState({
    quantity: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    expiryDate: "",
    location: {
      zone: "",
      aisle: "",
      rack: "",
      bin: "",
    },
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "archive" | "unarchive" | "bulk_archive" | "bulk_unarchive" | null;
    item: InventoryItem | null;
    count?: number;
  }>({
    isOpen: false,
    type: null,
    item: null,
  });

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusFilter,
      expiryStatus: expiryStatusFilter,
      sku: skuFilter,
      batchId: batchIdFilter,
    });

    refetch({
      page: 1,
      limit: 10,
      status: statusFilter || undefined,
      expiryStatus: expiryStatusFilter || undefined,
      sku: skuFilter || undefined,
      batchId: batchIdFilter || undefined,
    });
  };

  // Clear filters
  const clearFilters = () => {
    setStatusFilter("");
    setExpiryStatusFilter("");
    setSkuFilter("");
    setBatchIdFilter("");
    setAppliedFilters({
      status: "",
      expiryStatus: "",
      sku: "",
      batchId: "",
    });
    refetch({ page: 1, limit: 10 });
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
    if (selectedItems.length === inventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventory.map((item) => item._id));
    }
  };

  const isAllSelected =
    inventory.length > 0 && selectedItems.length === inventory.length;
  const isSomeSelected = selectedItems.length > 0 && !isAllSelected;

  // Open view modal
  const handleView = (item: InventoryItem) => {
    setViewModal({ isOpen: true, item });
  };

  // Close view modal
  const closeViewModal = () => {
    setViewModal({ isOpen: false, item: null });
  };

  // Open edit drawer
  const handleEdit = (item: InventoryItem) => {
    setEditDrawer({ isOpen: true, item });
    setEditFormData({
      quantity: item.quantity,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      expiryDate: item.expiryDate || "",
      location: item.location,
    });
  };

  // Close edit drawer
  const closeEditDrawer = () => {
    setEditDrawer({ isOpen: false, item: null });
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    if (!editDrawer.item) return;

    const payload: UpdateInventoryItemPayload = {
      quantity: editFormData.quantity,
      minStockLevel: editFormData.minStockLevel,
      maxStockLevel: editFormData.maxStockLevel,
      expiryDate: editFormData.expiryDate || undefined,
      location: editFormData.location,
    };

    const success = await updateInventoryItem(editDrawer.item._id, payload);
    if (success) {
      closeEditDrawer();
    }
  };

  // Handle archive confirmation
  const handleArchiveClick = (item: InventoryItem) => {
    setConfirmDialog({
      isOpen: true,
      type: "archive",
      item,
    });
  };

  // Handle unarchive confirmation
  const handleUnarchiveClick = (item: InventoryItem) => {
    setConfirmDialog({
      isOpen: true,
      type: "unarchive",
      item,
    });
  };

  // Handle bulk archive
  const handleBulkArchive = () => {
    if (selectedItems.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      type: "bulk_archive",
      item: null,
      count: selectedItems.length,
    });
  };

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

  // Confirm archive/unarchive
  const handleConfirm = async () => {
    if (!confirmDialog.type) return;

    let success = false;

    if (confirmDialog.type === "archive" && confirmDialog.item) {
      success = await archiveItem(confirmDialog.item._id);
    } else if (confirmDialog.type === "unarchive" && confirmDialog.item) {
      success = await unarchiveItem(confirmDialog.item._id);
    } else if (confirmDialog.type === "bulk_archive") {
      success = await bulkArchive(selectedItems);
    } else if (confirmDialog.type === "bulk_unarchive") {
      success = await bulkUnarchive(selectedItems);
    }

    if (success) {
      setConfirmDialog({ isOpen: false, type: null, item: null });
      setSelectedItems([]); // Clear selection after bulk operation
    }
  };

  // Cancel confirmation
  const handleCancelConfirm = () => {
    setConfirmDialog({ isOpen: false, type: null, item: null });
  };

  // Get status label
  const getStatusLabel = (value: string, options: typeof statusOptions) => {
    const option = options.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Get location string
  const getLocationString = (location: InventoryItem["location"]) => {
    return `${location.zone}-${location.aisle}-${location.rack}-${location.bin}`;
  };

  // Transform data for table
  const tableData = useMemo(() => {
    return inventory.map((item) => ({
      batchId: item.batchId,
      sku: item.sku,
      productName: item.productName,
      quantity: item.quantity,
      age: item.age,
      status: item.status,
      expiryDate: item.expiryDate
        ? new Date(item.expiryDate).toLocaleDateString()
        : "N/A",
      location: getLocationString(item.location),
      _id: item._id,
      _rawData: item,
    }));
  }, [inventory]);

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
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      );
    }

    if (key === "status") {
      const statusValue = value as string;

      let variant: "approved" | "warning" | "rejected" = "approved";
      if (statusValue === "low_stock") variant = "warning";
      if (statusValue === "out_of_stock") variant = "rejected";

      const labelMap: Record<string, string> = {
        active: "Active",
        low_stock: "Low Stock",
        out_of_stock: "Out of Stock",
      };

      const label = labelMap[statusValue] ?? statusValue;

      return (
        <Badge
          variant={variant}
          label={label}
          size="md"
          showDot
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
            title="View Details"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleView(item)}
          >
            <Eye className="text-purple-500 w-5 h-5" />
          </Button>
          <Button
            title="Edit"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleEdit(item)}
          >
            <EditIcon className="text-blue-500 w-5 h-5" />
          </Button>
          {item.isArchived ? (
            <Button
              title="Unarchive"
              size="sm"
              className="bg-transparent shadow-none hover:bg-gray-100 p-2"
              onClick={() => handleUnarchiveClick(item)}
            >
              <ArchiveRestore className="text-green-500 w-5 h-5" />
            </Button>
          ) : (
            <Button
              title="Archive"
              size="sm"
              className="bg-transparent shadow-none hover:bg-gray-100 p-2"
              onClick={() => handleArchiveClick(item)}
            >
              <Archive className="text-orange-500 w-5 h-5" />
            </Button>
          )}
        </div>
      );
    }

    return value as React.ReactNode;
  };

  const hasActiveFilters =
    appliedFilters.status ||
    appliedFilters.expiryStatus ||
    appliedFilters.sku ||
    appliedFilters.batchId;

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <BackHeader title={`Inventory - ${warehouse.name}`} />
        <div className="flex gap-4 items-center">
          <Button
            className="rounded-lg"
            variant="outline"
            size="md"
            onClick={() => router.push("/warehouse/inventory-layout/archive")}
          >
            <FileArchiveIcon size={18} className="mr-2" />
            Archived Items
          </Button>

          <Button variant="secondary" size="md" className="rounded-lg">
            Export Layout
          </Button>

          <Button variant="primary" size="md" className="rounded-lg">
            <ArrowDownToLine size={18} className="mr-2" />
            CSV Upload
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Items"
            count={stats.totalItems}
            icon={Package}
          />

          <StatCard
            title="Active Items"
            count={stats.activeItems}
            icon={CheckCircle}
          />

          <StatCard
            title="Low Stock"
            count={stats.lowStockItems}
            icon={TrendingDown}
          />

          <StatCard
            title="Expired / Near Expiry"
            count={stats.expiredItems + stats.nearExpiryItems}
            icon={AlertCircle}
          />
        </div>
      )}

      {/* Selection Bar */}
      {!loading && !error && inventory.length > 0 && (
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
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({inventory.length})
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
                  variant="danger"
                  size="md"
                  className="rounded-lg"
                  onClick={handleBulkArchive}
                  disabled={archiving}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Selected ({selectedItems.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <h2 className="text-gray-700 text-sm mb-2 font-semibold">Status</h2>
            <Select
              id="status-filter"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              selectClassName="px-4 py-3 bg-gray-100"
            />
          </div>
          <div>
            <h2 className="text-gray-700 text-sm mb-2 font-semibold">
              Expiry Status
            </h2>
            <Select
              id="expiry-status-filter"
              options={expiryStatusOptions}
              value={expiryStatusFilter}
              onChange={setExpiryStatusFilter}
              selectClassName="px-4 py-3 bg-gray-100"
            />
          </div>
          <Input
            id="sku-filter"
            label="SKU"
            type="text"
            placeholder="Search by SKU"
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
            variant="default"
          />
          <Input
            id="batch-filter"
            label="Batch ID"
            type="text"
            placeholder="Search by Batch ID"
            value={batchIdFilter}
            onChange={(e) => setBatchIdFilter(e.target.value)}
            variant="default"
          />
          <div className="flex items-end">
            <Button
              onClick={handleApplyFilters}
              variant="primary"
              className="rounded-lg w-full py-4"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Active Filters:
              </span>

              {appliedFilters.status && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">
                    Status:{" "}
                    {getStatusLabel(appliedFilters.status, statusOptions)}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    title="Remove filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {appliedFilters.expiryStatus && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">
                    Expiry:{" "}
                    {getStatusLabel(
                      appliedFilters.expiryStatus,
                      expiryStatusOptions
                    )}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    title="Remove filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {appliedFilters.sku && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">
                    SKU: {appliedFilters.sku}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    title="Remove filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {appliedFilters.batchId && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">
                    Batch: {appliedFilters.batchId}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    title="Remove filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={clearFilters}
                className="ml-2 text-sm text-red-600 hover:text-red-700 font-semibold underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-6 text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
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
            <div className="min-w-[1800px]">
              <Table
                columns={inventoryColumns}
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
                onPageChange={(newPage) => {
                  setPage(newPage);
                  refetch({ ...appliedFilters, page: newPage, limit: 10 });
                }}
              />
            </div>
          )}

          {/* Empty State */}
          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">No inventory items found</p>
            </div>
          )}
        </>
      )}

      {/* Edit Inventory Item Drawer */}
      <Drawer
        isOpen={editDrawer.isOpen}
        onClose={closeEditDrawer}
        title="Edit Inventory Item"
        size="lg"
        footer={
          <div className="flex gap-4 justify-end">
            <Button
              className="rounded-lg"
              variant="secondary"
              size="lg"
              onClick={closeEditDrawer}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg"
              variant="primary"
              size="lg"
              onClick={handleEditSubmit}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Item"}
            </Button>
          </div>
        }
      >
        {editDrawer.item && (
          <div className="space-y-6">
            {/* Item Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">
                    SKU
                  </Label>
                  <p className="text-lg text-gray-900">{editDrawer.item.sku}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">
                    Product Name
                  </Label>
                  <p className="text-lg text-gray-900">
                    {editDrawer.item.productName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">
                    Batch ID
                  </Label>
                  <p className="text-lg text-gray-900">
                    {editDrawer.item.batchId}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">
                    Age
                  </Label>
                  <p className="text-lg text-gray-900">
                    {editDrawer.item.age} days
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <Input
              id="quantity"
              label="Quantity"
              type="number"
              value={editFormData.quantity}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              variant="default"
            />

            {/* Stock Levels */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="min-stock"
                label="Min Stock Level"
                type="number"
                value={editFormData.minStockLevel}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    minStockLevel: parseInt(e.target.value) || 0,
                  })
                }
                variant="default"
              />
              <Input
                id="max-stock"
                label="Max Stock Level"
                type="number"
                value={editFormData.maxStockLevel}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    maxStockLevel: parseInt(e.target.value) || 0,
                  })
                }
                variant="default"
              />
            </div>

            {/* Expiry Date */}
            <Input
              id="expiry-date"
              label="Expiry Date"
              type="date"
              value={editFormData.expiryDate}
              onChange={(e) =>
                setEditFormData({ ...editFormData, expiryDate: e.target.value })
              }
              variant="default"
            />

            {/* Location */}
            <div>
              <Label className="text-lg font-semibold text-gray-700 mb-3 block">
                Location
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="zone"
                  label="Zone"
                  type="text"
                  value={editFormData.location.zone}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        zone: e.target.value,
                      },
                    })
                  }
                  variant="default"
                />
                <Input
                  id="aisle"
                  label="Aisle"
                  type="text"
                  value={editFormData.location.aisle}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        aisle: e.target.value,
                      },
                    })
                  }
                  variant="default"
                />
                <Input
                  id="rack"
                  label="Rack"
                  type="text"
                  value={editFormData.location.rack}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        rack: e.target.value,
                      },
                    })
                  }
                  variant="default"
                />
                <Input
                  id="bin"
                  label="Bin"
                  type="text"
                  value={editFormData.location.bin}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: {
                        ...editFormData.location,
                        bin: e.target.value,
                      },
                    })
                  }
                  variant="default"
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                {confirmDialog.type === "archive" ||
                confirmDialog.type === "bulk_archive" ? (
                  <Archive className="h-6 w-6 text-orange-600" />
                ) : (
                  <ArchiveRestore className="h-6 w-6 text-green-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {confirmDialog.type === "archive" && "Archive Inventory Item?"}
                {confirmDialog.type === "unarchive" &&
                  "Unarchive Inventory Item?"}
                {confirmDialog.type === "bulk_archive" &&
                  `Archive ${confirmDialog.count} Items?`}
                {confirmDialog.type === "bulk_unarchive" &&
                  `Unarchive ${confirmDialog.count} Items?`}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {confirmDialog.type === "archive" &&
                  confirmDialog.item &&
                  `Are you sure you want to archive ${confirmDialog.item.productName} (${confirmDialog.item.sku})? This will move it to the archived items list.`}
                {confirmDialog.type === "unarchive" &&
                  confirmDialog.item &&
                  `Are you sure you want to unarchive ${confirmDialog.item.productName} (${confirmDialog.item.sku})? This will restore it to the active inventory.`}
                {confirmDialog.type === "bulk_archive" &&
                  `Are you sure you want to archive ${confirmDialog.count} selected items? This will move them to the archived items list.`}
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
                  variant={
                    confirmDialog.type === "archive" ? "danger" : "primary"
                  }
                  size="md"
                  className="rounded-lg"
                  onClick={handleConfirm}
                  disabled={archiving}
                >
                  {archiving
                    ? confirmDialog.type === "archive"
                      ? "Archiving..."
                      : "Unarchiving..."
                    : confirmDialog.type === "archive"
                    ? "Archive"
                    : "Unarchive"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewModal.isOpen && viewModal.item && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b shrink-0">
              <h3 className="text-2xl font-bold text-gray-900">
                Inventory Item Details
              </h3>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-8 py-6 flex-1">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        SKU
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.sku}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Product Name
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.productName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Batch ID
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.batchId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warehouse & Status */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Warehouse & Status
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Warehouse Name
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.warehouse.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Warehouse Code
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.warehouse.code}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Status
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            viewModal.item.status === "active"
                              ? "approved"
                              : viewModal.item.status === "low_stock"
                              ? "warning"
                              : "rejected"
                          }
                          label={viewModal.item.status
                            .replace("_", " ")
                            .toUpperCase()}
                          size="md"
                          showDot={true}
                          className="px-3 py-1 text-sm rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Archived Status
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.isArchived ? "Archived" : "Active"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Quantity Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Current Quantity
                      </Label>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {viewModal.item.quantity}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Min Stock Level
                      </Label>
                      <p className="text-2xl font-bold text-orange-600 mt-1">
                        {viewModal.item.minStockLevel}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Max Stock Level
                      </Label>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {viewModal.item.maxStockLevel}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Age
                      </Label>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {viewModal.item.age} days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Location Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Zone
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.location.zone}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Aisle
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.location.aisle}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Rack
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.location.rack}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Bin
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.location.bin}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dates & Expiry */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Dates & Expiry
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Expiry Date
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.expiryDate
                          ? new Date(
                              viewModal.item.expiryDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Created At
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {new Date(viewModal.item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Last Updated
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {new Date(viewModal.item.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    {viewModal.item.archivedAt && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">
                          Archived At
                        </Label>
                        <p className="text-base text-gray-900 mt-1">
                          {new Date(viewModal.item.archivedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Created By Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Created By
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Name
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.createdBy.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Email
                      </Label>
                      <p className="text-base text-gray-900 mt-1">
                        {viewModal.item.createdBy.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        User ID
                      </Label>
                      <p className="text-gray-900 mt-1 font-mono text-sm">
                        {viewModal.item.createdBy.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    System Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">
                        Inventory ID
                      </Label>
                      <p className="text-gray-900 mt-1 font-mono text-sm">
                        {viewModal.item._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="px-8 py-6 border-t flex justify-end shrink-0">
              <Button
                variant="secondary"
                size="lg"
                className="rounded-lg"
                onClick={closeViewModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
