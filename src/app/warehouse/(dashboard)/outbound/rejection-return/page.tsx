"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Eye, X } from "lucide-react";
import {
  Label,
  Select,
  Input,
  Button,
  Table,
  Badge,
  ConfirmDialog,
  Drawer
} from "@/components";
import { useReturnQueue, useVendors, useMyWarehouse } from "@/hooks/warehouse";
import { warehouseAPI } from "@/services/warehouseAPI";
import type { ReturnOrder, CreateReturnOrderPayload, InventoryItem } from "@/types";
import { toast } from "react-hot-toast";

const returnQueueColumns = [
  { label: "Batch ID", key: "batchId" },
  { label: "Vendor", key: "vendor_name" },
  { label: "Reason", key: "reason" },
  { label: "Quantity", key: "quantity" },
  { label: "Type", key: "returnType" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const returnTypeOptions = [
  { label: "All", value: "" },
  { label: "Damaged", value: "damaged" },
  { label: "Expired", value: "expired" },
  { label: "Quality Issue", value: "quality_issue" },
  { label: "Other", value: "other" },
];

export default function RejectionReturnQueuePage() {
  const router = useRouter();

  // Fetch return queue and vendors
  const {
    returns,
    loading,
    error,
    refetch,
    createReturn,
    approveReturn,
    rejectReturn,
    creating,
    approving,
    rejecting
  } = useReturnQueue();

  const { vendors } = useVendors();
  const { warehouse } = useMyWarehouse();

  // Inventory state for batch IDs
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // Form state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    batchId: "",
    vendor: "",
    reason: "",
    quantity: 0,
  });

  // View dialog state
  const [viewDialog, setViewDialog] = useState<{
    isOpen: boolean;
    returnOrder: ReturnOrder | null;
  }>({
    isOpen: false,
    returnOrder: null,
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    isLoading: false,
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [returnTypeFilter, setReturnTypeFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");
  const [appliedReturnTypeFilter, setAppliedReturnTypeFilter] = useState("");

  // Vendor options
  const vendorOptions = useMemo(() => {
    return vendors.map(vendor => ({
      label: vendor.vendor_name,
      value: vendor._id,
    }));
  }, [vendors]);

  // Batch ID options from inventory
  const batchIdOptions = useMemo(() => {
    // Get unique batch IDs from inventory
    const uniqueBatchIds = Array.from(
      new Set(inventoryItems.map(item => item.batchId))
    );

    return uniqueBatchIds.map(batchId => ({
      label: batchId,
      value: batchId,
    }));
  }, [inventoryItems]);

  // Fetch inventory items for batch IDs
  useEffect(() => {
    const fetchInventory = async () => {
      if (!warehouse?._id) return;

      try {
        const response = await warehouseAPI.getInventoryDashboard(warehouse._id, {
          limit: 1000, // Get all items
        });

        const apiResponse = response.data;
        if (apiResponse.success && apiResponse.data) {
          setInventoryItems(apiResponse.data.inventory);
        }
      } catch (err) {
        console.error('Error fetching inventory for batch IDs:', err);
      }
    };

    fetchInventory();
  }, [warehouse?._id]);

  // Reset form
  const resetForm = () => {
    setFormData({
      batchId: "",
      vendor: "",
      reason: "",
      quantity: 0,
    });
    setIsFormVisible(false);
  };

  // Create return order
  const handleCreateReturn = async () => {
    // Validation
    if (!formData.batchId.trim()) {
      toast.error("Please enter a batch ID");
      return;
    }
    if (!formData.vendor) {
      toast.error("Please select a vendor");
      return;
    }
    if (!formData.reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    if (formData.quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const payload: CreateReturnOrderPayload = {
      batchId: formData.batchId,
      vendor: formData.vendor,
      warehouse: warehouse?._id || "",
      reason: formData.reason,
      quantity: formData.quantity,
      returnType: "damaged", // Default type
    };

    const success = await createReturn(payload);
    if (success) {
      resetForm();
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedStatusFilter(statusFilter);
    setAppliedReturnTypeFilter(returnTypeFilter);
    refetch({
      status: statusFilter as any,
      returnType: returnTypeFilter as any,
    });
  };

  // Clear individual filter
  const clearStatusFilter = () => {
    setStatusFilter("");
    setAppliedStatusFilter("");
    refetch({ returnType: appliedReturnTypeFilter as any });
  };

  const clearReturnTypeFilter = () => {
    setReturnTypeFilter("");
    setAppliedReturnTypeFilter("");
    refetch({ status: appliedStatusFilter as any });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter("");
    setReturnTypeFilter("");
    setAppliedStatusFilter("");
    setAppliedReturnTypeFilter("");
    refetch({});
  };

  // Handle approve
  const handleApprove = (returnOrder: ReturnOrder) => {
    setConfirmDialog({
      isOpen: true,
      title: "Approve Return",
      message: `Are you sure you want to approve the return for batch "${returnOrder.batchId}"?`,
      onConfirm: async () => {
        const success = await approveReturn(returnOrder._id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      isLoading: approving,
    });
  };

  // Handle reject
  const handleReject = (returnOrder: ReturnOrder) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reject Return",
      message: `Are you sure you want to reject the return for batch "${returnOrder.batchId}"?`,
      onConfirm: async () => {
        const success = await rejectReturn(returnOrder._id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      isLoading: rejecting,
    });
  };

  // Handle view
  const handleView = (returnOrder: ReturnOrder) => {
    setViewDialog({
      isOpen: true,
      returnOrder,
    });
  };

  // Close dialogs
  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const closeViewDialog = () => {
    setViewDialog({ isOpen: false, returnOrder: null });
  };

  // Get status label
  const getStatusLabel = (value: string) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Get return type label
  const getReturnTypeLabel = (value: string) => {
    const option = returnTypeOptions.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Transform data for table
  const tableData = useMemo(() => {
    return returns.map((returnOrder) => ({
      batchId: returnOrder.batchId,
      vendor_name: returnOrder.vendor?.vendor_name || "N/A",
      reason: returnOrder.reason,
      quantity: returnOrder.quantity,
      returnType: returnOrder.returnType,
      status: returnOrder.status,
      _id: returnOrder._id,
      _rawData: returnOrder,
    }));
  }, [returns]);

  // Render cell
  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "status") {
      const variantMap: Record<string, any> = {
        approved: "approved",
        pending: "orange",
        rejected: "inactive",
      };

      return (
        <Badge
          variant={variantMap[value] || "info"}
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          size="md"
          showDot={true}
          className="px-3 py-1 text-sm rounded-full"
        />
      );
    }

    if (key === "returnType") {
      return (
        <span className="text-sm text-gray-700 capitalize">
          {value.replace(/_/g, ' ')}
        </span>
      );
    }

    if (key === "actions") {
      const isPending = row?.status === "pending";
      return (
        <div className="flex items-center gap-2">
          <Button
            title="View"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleView(row?._rawData)}
          >
            <Eye className="text-green-500 w-5 h-5" />
          </Button>
          {isPending && (
            <>
              <Button
                title="Approve"
                size="sm"
                variant="approve"
                className="rounded-lg px-3 py-1"
                onClick={() => handleApprove(row?._rawData)}
                disabled={approving}
              >
                Approve
              </Button>
              <Button
                title="Reject"
                size="sm"
                variant="reject"
                className="rounded-lg px-3 py-1"
                onClick={() => handleReject(row?._rawData)}
                disabled={rejecting}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      );
    }

    return value;
  };

  const hasActiveFilters = appliedStatusFilter || appliedReturnTypeFilter;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 my-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Rejection / Return Queue
          </h1>
        </div>
        <Button
          variant="primary"
          size="md"
          className="rounded-lg"
          onClick={() => setIsFormVisible(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Return Order
        </Button>
      </div>

      {/* Warehouse Info Card */}
      {warehouse && (
        <div className="bg-linear-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-900">Managing returns for:</p>
              <p className="text-lg font-bold text-orange-950">{warehouse.name}</p>
              <p className="text-xs text-orange-700">Code: {warehouse.code}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Return Order Drawer */}
      <Drawer
        isOpen={isFormVisible}
        onClose={resetForm}
        title="Create Return Order"
        size="lg"
        footer={
          <div className="flex gap-4 justify-end">
            <Button
              className="rounded-lg"
              variant="secondary"
              size="lg"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg"
              variant="primary"
              size="lg"
              onClick={handleCreateReturn}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Return Order"}
            </Button>
          </div>
        }
      >
        {/* Batch ID */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Batch ID
          </Label>
          <Select
            id="batchId"
            value={formData.batchId}
            options={batchIdOptions}
            placeholder="Select Batch ID"
            onChange={(val) => setFormData({ ...formData, batchId: val })}
            selectClassName="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Vendor Selection */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Vendor
          </Label>
          <Select
            id="vendor"
            value={formData.vendor}
            options={vendorOptions}
            placeholder="Select Vendor"
            onChange={(val) => setFormData({ ...formData, vendor: val })}
            selectClassName="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Reason */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Reason
          </Label>
          <Input
            type="text"
            placeholder="e.g., Damaged packaging found during inspection"
            variant="default"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Quantity
          </Label>
          <Input
            type="number"
            placeholder="e.g., 10"
            variant="default"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
          />
        </div>
      </Drawer>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            id="status-filter"
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            selectClassName="px-4 py-2"
          />
          <Select
            id="return-type-filter"
            label="Return Type"
            options={returnTypeOptions}
            value={returnTypeFilter}
            onChange={setReturnTypeFilter}
            selectClassName="px-4 py-2"
          />
          <div className="flex items-end">
            <Button
              onClick={handleApplyFilters}
              variant="primary"
              className="rounded-lg w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">Active Filters:</span>

              {appliedStatusFilter && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">Status: {getStatusLabel(appliedStatusFilter)}</span>
                  <button
                    onClick={clearStatusFilter}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    title="Remove status filter"
                    aria-label="Remove status filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {appliedReturnTypeFilter && (
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">Type: {getReturnTypeLabel(appliedReturnTypeFilter)}</span>
                  <button
                    onClick={clearReturnTypeFilter}
                    className="ml-1 hover:bg-orange-200 rounded-full p-1 transition-colors"
                    title="Remove type filter"
                    aria-label="Remove type filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                onClick={clearAllFilters}
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
          <p className="mt-4 text-gray-600">Loading return queue...</p>
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
          <div className="mt-6">
            <Table
              columns={returnQueueColumns}
              data={tableData}
              renderCell={renderCell}
            />
          </div>

          {/* Empty State */}
          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">No return orders found</p>
            </div>
          )}
        </>
      )}

      {/* View Return Order Dialog */}
      {viewDialog.isOpen && viewDialog.returnOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Return Order Details
              </h2>
              <button
                onClick={closeViewDialog}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-600">Batch ID</Label>
                <p className="text-lg text-gray-900">{viewDialog.returnOrder.batchId}</p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">Vendor</Label>
                <p className="text-lg text-gray-900">{viewDialog.returnOrder.vendor?.vendor_name || "N/A"}</p>
                {viewDialog.returnOrder.vendor && (
                  <p className="text-sm text-gray-600">{viewDialog.returnOrder.vendor.vendor_email}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">Reason</Label>
                <p className="text-lg text-gray-900">{viewDialog.returnOrder.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Quantity</Label>
                  <p className="text-lg text-gray-900">{viewDialog.returnOrder.quantity}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Return Type</Label>
                  <p className="text-lg text-gray-900 capitalize">
                    {viewDialog.returnOrder.returnType.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">Status</Label>
                <Badge
                  variant={
                    viewDialog.returnOrder.status === "approved" ? "approved" :
                    viewDialog.returnOrder.status === "pending" ? "orange" : "inactive"
                  }
                  label={viewDialog.returnOrder.status.charAt(0).toUpperCase() + viewDialog.returnOrder.status.slice(1)}
                  size="md"
                  showDot={true}
                  className="px-3 py-1 text-sm rounded-full"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Created By</Label>
                    <p className="text-gray-900">{viewDialog.returnOrder.createdBy?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Created At</Label>
                    <p className="text-gray-900">
                      {new Date(viewDialog.returnOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="secondary"
                size="md"
                className="rounded-lg"
                onClick={closeViewDialog}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.title.includes("Approve") ? "Approve" : "Reject"}
        cancelText="Cancel"
        confirmVariant={confirmDialog.title.includes("Approve") ? "primary" : "danger"}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        isLoading={confirmDialog.isLoading}
      />
    </div>
  );
}
