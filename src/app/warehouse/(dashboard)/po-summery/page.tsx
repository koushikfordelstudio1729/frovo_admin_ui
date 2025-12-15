"use client";

import { BackHeader, Badge, Button, Table, Select, Input, ConfirmDialog } from "@/components";
import { ViewPODialog } from "@/components/warehouse";
import { usePurchaseOrders, usePurchaseOrder } from "@/hooks/warehouse";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Edit, Trash2, X, FileText } from "lucide-react";
import type { POStatus, PurchaseOrder } from "@/types";

const poSummaryColumns = [
  { label: "PO Number", key: "po_number" },
  { label: "PO Status", key: "po_status" },
  { label: "PO Raised Date", key: "po_raised_date" },
  { label: "Vendor Name", key: "vendor_name" },
  { label: "Total Items", key: "total_items" },
  { label: "Created By", key: "created_by" },
  { label: "Actions", key: "actions" },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Approved", value: "approved" },
  { label: "Received", value: "received" },
  { label: "Delivered", value: "delivered" },
];

const PoSummery = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch purchase orders
  const { purchaseOrders, loading, error, refetch } = usePurchaseOrders();
  const { deletePurchaseOrder, deleting } = usePurchaseOrder();

  // View dialog state
  const [viewDialog, setViewDialog] = useState<{
    isOpen: boolean;
    purchaseOrder: PurchaseOrder | null;
  }>({
    isOpen: false,
    purchaseOrder: null,
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Apply filters
  const handleApplyFilters = () => {
    const params: any = {};
    if (statusFilter) params.po_status = statusFilter as POStatus;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    refetch(params);
  };

  // Clear individual filter
  const clearStatusFilter = () => {
    setStatusFilter("");
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    refetch(params);
  };

  const clearStartDateFilter = () => {
    setStartDate("");
    const params: any = {};
    if (statusFilter) params.po_status = statusFilter as POStatus;
    if (endDate) params.endDate = endDate;
    refetch(params);
  };

  const clearEndDateFilter = () => {
    setEndDate("");
    const params: any = {};
    if (statusFilter) params.po_status = statusFilter as POStatus;
    if (startDate) params.startDate = startDate;
    refetch(params);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    refetch({});
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter || startDate || endDate;

  // Get status label
  const getStatusLabel = (value: string) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Transform data for table
  const tableData = useMemo(() => {
    return purchaseOrders.map((po) => ({
      po_number: po.po_number,
      po_status: po.po_status,
      po_raised_date: format(new Date(po.po_raised_date), "dd-MM-yyyy"),
      vendor_name: po.vendor_details?.vendor_name || "N/A",
      total_items: po.po_line_items.length,
      created_by: po.createdBy?.name || "N/A",
      _id: po._id,
      _rawData: po,
    }));
  }, [purchaseOrders]);

  const handleView = (row: any) => {
    // Find the full purchase order data
    const po = purchaseOrders.find(p => p._id === row._id);
    if (po) {
      setViewDialog({
        isOpen: true,
        purchaseOrder: po,
      });
    }
  };

  const handleEdit = (row: any) => {
    router.push(`/warehouse/raise-po?edit=${row._id}`);
  };

  const handleDelete = (row: any) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Purchase Order",
      message: `Are you sure you want to delete PO ${row.po_number}? This action cannot be undone.`,
      onConfirm: async () => {
        const success = await deletePurchaseOrder(row._id);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        if (success) {
          refetch(); // Refresh the list
        }
      },
    });
  };

  const handleCreateGRN = (row: any) => {
    router.push(`/warehouse/create-grn?poId=${row._id}`);
  };

  const closeDialog = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "po_status") {
      const variantMap: Record<string, any> = {
        approved: "approved",
        draft: "inactive",
        received: "approved",
        delivered: "approved",
        pending: "orange",
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

    if (key === "actions") {
      return (
        <div className="flex items-center gap-2">
          <Button
            title="View"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleView(row)}
          >
            <Eye className="text-green-500 w-5 h-5" />
          </Button>
          <Button
            title="Create GRN"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleCreateGRN(row)}
            disabled={row?.po_status !== 'approved'}
          >
            <FileText className="text-purple-500 w-5 h-5" />
          </Button>
          <Button
            title="Edit"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleEdit(row)}
            disabled={row?.po_status === 'delivered'}
          >
            <Edit className="text-blue-500 w-5 h-5" />
          </Button>
          <Button
            title="Delete"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleDelete(row)}
            disabled={deleting || row?.po_status !== 'draft'}
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </Button>
        </div>
      );
    }

    return value;
  };

  return (
    <div className="min-h-screen pt-4">
      <BackHeader title="PO Summary Table" />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            id="status-filter"
            label="PO Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            selectClassName="px-4 py-2"
          />
          <Input
            id="start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            variant="orange"
          />
          <Input
            id="end-date"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            variant="orange"
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
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>

              {statusFilter && (
                <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  <span>Status: {getStatusLabel(statusFilter)}</span>
                  <button
                    onClick={clearStatusFilter}
                    className="ml-1 hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                    title="Remove status filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {startDate && (
                <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <span>From: {format(new Date(startDate), "dd MMM yyyy")}</span>
                  <button
                    onClick={clearStartDateFilter}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    title="Remove start date filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {endDate && (
                <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <span>To: {format(new Date(endDate), "dd MMM yyyy")}</span>
                  <button
                    onClick={clearEndDateFilter}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    title="Remove end date filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <button
                onClick={clearAllFilters}
                className="ml-2 text-sm text-red-600 hover:text-red-700 font-medium underline"
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
          <p className="mt-4 text-gray-600">Loading purchase orders...</p>
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
              columns={poSummaryColumns}
              data={tableData}
              renderCell={renderCell}
            />
          </div>

          {/* Empty State */}
          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">No purchase orders found</p>
            </div>
          )}
        </>
      )}

      {/* Raise PO Button */}
      <div className="mt-8">
        <Button
          className="rounded-lg px-6"
          variant="primary"
          onClick={() => router.push("/warehouse/raise-po")}
        >
          Raise Purchase Order
        </Button>
      </div>

      {/* View PO Dialog */}
      <ViewPODialog
        isOpen={viewDialog.isOpen}
        purchaseOrder={viewDialog.purchaseOrder}
        onClose={() => setViewDialog({ isOpen: false, purchaseOrder: null })}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeDialog}
        isLoading={deleting}
      />
    </div>
  );
};

export default PoSummery;
