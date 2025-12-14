"use client";

import { BackHeader, Badge, Button, Table, Select, Input, Textarea } from "@/components";
import { useGRNs, useGRN } from "@/hooks/warehouse";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, X, Edit2 } from "lucide-react";
import type { QCStatus, GRN } from "@/types";

const grnSummaryColumns = [
  { label: "Delivery Challan", key: "delivery_challan" },
  { label: "PO Number", key: "po_number" },
  { label: "Vendor Name", key: "vendor_name" },
  { label: "Received Date", key: "recieved_date" },
  { label: "Vehicle Number", key: "vehicle_number" },
  { label: "QC Status", key: "qc_status" },
  { label: "Total Items", key: "total_items" },
  { label: "Actions", key: "actions" },
];

const qcStatusOptions = [
  { label: "All", value: "" },
  { label: "Excellent", value: "excellent" },
  { label: "Moderate", value: "moderate" },
  { label: "Bad", value: "bad" },
];

const GRNSummary = () => {
  const router = useRouter();
  const [qcStatusFilter, setQcStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch GRNs
  const { grns, loading, error, refetch } = useGRNs();

  // Update status dialog state
  const { updateGRNStatus, updating } = useGRN();
  const [updateDialog, setUpdateDialog] = useState<{
    isOpen: boolean;
    grnId: string | null;
    currentStatus: QCStatus | null;
    currentRemarks: string;
  }>({
    isOpen: false,
    grnId: null,
    currentStatus: null,
    currentRemarks: "",
  });

  const [newQcStatus, setNewQcStatus] = useState<QCStatus>("excellent");
  const [statusRemarks, setStatusRemarks] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Apply filters
  const handleApplyFilters = () => {
    const params: any = {};
    if (qcStatusFilter) params.qc_status = qcStatusFilter as QCStatus;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    refetch(params);
  };

  // Clear individual filter
  const clearQcStatusFilter = () => {
    setQcStatusFilter("");
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    refetch(params);
  };

  const clearStartDateFilter = () => {
    setStartDate("");
    const params: any = {};
    if (qcStatusFilter) params.qc_status = qcStatusFilter as QCStatus;
    if (endDate) params.endDate = endDate;
    refetch(params);
  };

  const clearEndDateFilter = () => {
    setEndDate("");
    const params: any = {};
    if (qcStatusFilter) params.qc_status = qcStatusFilter as QCStatus;
    if (startDate) params.startDate = startDate;
    refetch(params);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQcStatusFilter("");
    setStartDate("");
    setEndDate("");
    refetch({});
  };

  // Check if any filters are active
  const hasActiveFilters = qcStatusFilter || startDate || endDate;

  // Get QC status label
  const getQcStatusLabel = (value: string) => {
    const option = qcStatusOptions.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Transform data for table
  const tableData = useMemo(() => {
    return grns.map((grn) => ({
      delivery_challan: grn.delivery_challan,
      po_number: grn.purchase_order?.po_number || "N/A",
      vendor_name: grn.vendor_details?.vendor_name || "N/A",
      recieved_date: format(new Date(grn.recieved_date), "dd-MM-yyyy"),
      vehicle_number: grn.vehicle_number,
      qc_status: grn.qc_status,
      total_items: grn.grn_line_items.length,
      _id: grn._id,
      _rawData: grn,
    }));
  }, [grns]);

  const handleView = (row: any) => {
    router.push(`/warehouse/grn-summary/${row._id}`);
  };

  const handleOpenUpdateDialog = (row: any) => {
    const grn = grns.find(g => g._id === row._id);
    if (grn) {
      setUpdateDialog({
        isOpen: true,
        grnId: grn._id,
        currentStatus: grn.qc_status,
        currentRemarks: grn.remarks,
      });
      setNewQcStatus(grn.qc_status);
      setStatusRemarks(grn.remarks);
    }
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialog({
      isOpen: false,
      grnId: null,
      currentStatus: null,
      currentRemarks: "",
    });
    setNewQcStatus("excellent");
    setStatusRemarks("");
  };

  const handleUpdateStatus = async () => {
    if (!updateDialog.grnId) return;

    const result = await updateGRNStatus(updateDialog.grnId, {
      qc_status: newQcStatus,
      remarks: statusRemarks,
    });

    if (result) {
      setSuccessMessage("GRN status updated successfully!");
      handleCloseUpdateDialog();
      refetch(); // Refresh the list
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "qc_status") {
      const variantMap: Record<string, any> = {
        excellent: "approved",
        moderate: "orange",
        bad: "inactive",
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
            title="Update Status"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleOpenUpdateDialog(row)}
          >
            <Edit2 className="text-blue-500 w-5 h-5" />
          </Button>
        </div>
      );
    }

    return value;
  };

  return (
    <div className="min-h-screen pt-4">
      <BackHeader title="GRN Summary" />

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            id="qc-status-filter"
            label="QC Status"
            options={qcStatusOptions}
            value={qcStatusFilter}
            onChange={setQcStatusFilter}
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

              {qcStatusFilter && (
                <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                  <span>QC Status: {getQcStatusLabel(qcStatusFilter)}</span>
                  <button
                    onClick={clearQcStatusFilter}
                    className="ml-1 hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                    title="Remove QC status filter"
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
          <p className="mt-4 text-gray-600">Loading GRNs...</p>
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
              columns={grnSummaryColumns}
              data={tableData}
              renderCell={renderCell}
            />
          </div>

          {/* Empty State */}
          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">No GRNs found</p>
            </div>
          )}
        </>
      )}

      {/* Create GRN Button */}
      <div className="mt-8">
        <Button
          className="rounded-lg px-6"
          variant="primary"
          onClick={() => router.push("/warehouse/create-grn")}
        >
          Create GRN
        </Button>
      </div>

      {/* Update Status Dialog */}
      {updateDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseUpdateDialog}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={handleCloseUpdateDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={updating}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 pr-8">Update GRN Status</h3>
            <p className="text-sm text-gray-600 mb-6">
              Current Status: <span className="font-semibold capitalize">{updateDialog.currentStatus}</span>
            </p>

            {/* Form */}
            <div className="space-y-4">
              <Select
                id="update-qc-status"
                label="New QC Status *"
                selectClassName="px-4 py-3 border-2 border-orange-300"
                options={qcStatusOptions}
                value={newQcStatus}
                onChange={(val) => setNewQcStatus(val as QCStatus)}
              />

              <Textarea
                label="Remarks"
                variant="orange"
                placeholder="Enter remarks..."
                rows={4}
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={handleCloseUpdateDialog}
                disabled={updating}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateStatus}
                disabled={updating}
                isLoading={updating}
                className="rounded-lg"
              >
                {updating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GRNSummary;
