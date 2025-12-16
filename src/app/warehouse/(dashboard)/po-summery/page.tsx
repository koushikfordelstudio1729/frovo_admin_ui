"use client";

import {
  BackHeader,
  Badge,
  Button,
  Table,
  Select,
  Input,
  ConfirmDialog,
  Pagination,
  Label,
} from "@/components";
import { ViewPODialog } from "@/components/warehouse";
import { usePurchaseOrders, usePurchaseOrder } from "@/hooks/warehouse";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Edit, Trash2, X, FileText, Search } from "lucide-react";
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
  const [globalSearch, setGlobalSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Apply client-side filters
  const filteredData = useMemo(() => {
    let filtered = [...tableData];

    // Global search across PO number and Vendor name
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      filtered = filtered.filter(
        (po) =>
          po.po_number.toLowerCase().includes(q) ||
          po.vendor_name.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((po) => po.po_status === statusFilter);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((po) => {
        const poDate = new Date(
          po.po_raised_date.split("-").reverse().join("-")
        );
        const start = new Date(startDate);
        return poDate >= start;
      });
    }

    if (endDate) {
      filtered = filtered.filter((po) => {
        const poDate = new Date(
          po.po_raised_date.split("-").reverse().join("-")
        );
        const end = new Date(endDate);
        return poDate <= end;
      });
    }

    return filtered;
  }, [tableData, globalSearch, statusFilter, startDate, endDate]);

  // Calculate total pages based on filtered data
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Apply pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Reset all filters
  const handleResetFilters = () => {
    setGlobalSearch("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Clear individual filters
  const clearStatusFilter = () => {
    setStatusFilter("");
    setCurrentPage(1);
  };

  const clearStartDateFilter = () => {
    setStartDate("");
    setCurrentPage(1);
  };

  const clearEndDateFilter = () => {
    setEndDate("");
    setCurrentPage(1);
  };

  const clearSearchFilter = () => {
    setGlobalSearch("");
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = globalSearch || statusFilter || startDate || endDate;

  // Get status label
  const getStatusLabel = (value: string) => {
    const option = statusOptions.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (row: any) => {
    const po = purchaseOrders.find((p) => p._id === row._id);
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
          refetch();
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
        approved: "warning",
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
            disabled={row?.po_status !== "approved"}
          >
            <FileText className="text-purple-500 w-5 h-5" />
          </Button>
          <Button
            title="Edit"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleEdit(row)}
            disabled={row?.po_status === "delivered"}
          >
            <Edit className="text-blue-500 w-5 h-5" />
          </Button>
          <Button
            title="Delete"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleDelete(row)}
            disabled={deleting || row?.po_status !== "draft"}
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
      <div className="flex items-center justify-between">
        <BackHeader title="PO Summary Table" />
        <div className="mt-8">
          <Button
            className="rounded-lg px-6"
            variant="primary"
            onClick={() => router.push("/warehouse/raise-po")}
          >
            Raise Purchase Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 mt-6">
        <div className="grid grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="col-span-2">
            <Input
              id="global-search"
              label="Search"
              type="text"
              placeholder="Search by PO Number or Vendor Name"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              variant="orange"
              startIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>

          {/* PO Status */}
          <Select
            id="status-filter"
            label="PO Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            selectClassName="px-4 py-4 border-2 border-orange-300"
          />

          {/* Start Date */}
          <Input
            id="start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            variant="orange"
          />

          {/* End Date */}
          <Input
            id="end-date"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            variant="orange"
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleResetFilters}
              variant="secondary"
              className="rounded-lg px-6"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Active Filters:
              </span>

              {globalSearch && (
                <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <span>Search: {globalSearch}</span>
                  <button
                    onClick={clearSearchFilter}
                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                    title="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

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
                  <span>
                    From: {format(new Date(startDate), "dd MMM yyyy")}
                  </span>
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
              data={paginatedData}
              renderCell={renderCell}
            />
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">
                {hasActiveFilters
                  ? "No purchase orders match your filters"
                  : "No purchase orders found"}
              </p>
            </div>
          )}
        </>
      )}

      <div className="mt-6 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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
