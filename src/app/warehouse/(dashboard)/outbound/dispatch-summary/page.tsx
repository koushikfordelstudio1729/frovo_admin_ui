"use client";

import { BackHeader, Badge, Button, Table, Select, Input } from "@/components";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Edit2, X } from "lucide-react";
import type { DispatchStatus, DispatchOrder } from "@/types";
import { warehouseAPI } from "@/services/warehouseAPI";
import { toast } from "react-hot-toast";

const dispatchSummaryColumns = [
  { label: "Dispatch ID", key: "dispatchId" },
  { label: "Status", key: "status" },
  { label: "Destination", key: "destination" },
  { label: "Assigned Agent", key: "assignedAgent" },
  { label: "Total Products", key: "total_products" },
  { label: "Created By", key: "created_by" },
  { label: "Created At", key: "created_at" },
  { label: "Actions", key: "actions" },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const updateStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Transit", value: "in_transit" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const DispatchSummary = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("");
  const [dispatchOrders, setDispatchOrders] = useState<DispatchOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View dialog state
  const [viewDialog, setViewDialog] = useState<{
    isOpen: boolean;
    dispatch: DispatchOrder | null;
  }>({
    isOpen: false,
    dispatch: null,
  });

  // Update status dialog
  const [updateDialog, setUpdateDialog] = useState<{
    isOpen: boolean;
    dispatchId: string | null;
    currentStatus: DispatchStatus | null;
  }>({
    isOpen: false,
    dispatchId: null,
    currentStatus: null,
  });

  const [newStatus, setNewStatus] = useState<DispatchStatus>("pending");
  const [updating, setUpdating] = useState(false);

  // Fetch dispatch orders
  const fetchDispatchOrders = async (params?: { status?: DispatchStatus }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseAPI.getDispatchOrders(params);
      const apiResponse = response.data;
      if (apiResponse.success) {
        setDispatchOrders(apiResponse.data);
      }
    } catch (err) {
      console.error("Error fetching dispatch orders:", err);
      setError("Failed to load dispatch orders");
      toast.error("Failed to load dispatch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatchOrders();
  }, []);

  // Apply filters
  const handleApplyFilters = () => {
    const params: any = {};
    if (statusFilter) params.status = statusFilter as DispatchStatus;
    fetchDispatchOrders(params);
  };

  // Clear status filter
  const clearStatusFilter = () => {
    setStatusFilter("");
    fetchDispatchOrders({});
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter("");
    fetchDispatchOrders({});
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== "";

  // Get status label
  const getStatusLabel = (value: string) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Transform data for table
  const tableData = useMemo(() => {
    return dispatchOrders.map((dispatch) => ({
      dispatchId: dispatch.dispatchId,
      status: dispatch.status,
      destination: dispatch.destination.length > 50
        ? dispatch.destination.substring(0, 50) + "..."
        : dispatch.destination,
      assignedAgent: dispatch.assignedAgent.name,
      total_products: dispatch.products.length,
      created_by: dispatch.createdBy?.name || "N/A",
      created_at: format(new Date(dispatch.createdAt), "dd-MM-yyyy HH:mm"),
      _id: dispatch._id,
      _rawData: dispatch,
    }));
  }, [dispatchOrders]);

  const handleView = (row: any) => {
    const dispatch = dispatchOrders.find(d => d._id === row._id);
    if (dispatch) {
      setViewDialog({
        isOpen: true,
        dispatch: dispatch,
      });
    }
  };

  const handleUpdateStatus = (row: any) => {
    setUpdateDialog({
      isOpen: true,
      dispatchId: row._id,
      currentStatus: row.status,
    });
    setNewStatus(row.status);
  };

  const handleStatusUpdate = async () => {
    if (!updateDialog.dispatchId) return;

    try {
      setUpdating(true);
      const response = await warehouseAPI.updateDispatchOrderStatus(
        updateDialog.dispatchId,
        { status: newStatus }
      );
      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success("Dispatch status updated successfully");
        setUpdateDialog({ isOpen: false, dispatchId: null, currentStatus: null });
        fetchDispatchOrders(); // Refresh the list
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update dispatch status");
    } finally {
      setUpdating(false);
    }
  };

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "status") {
      const variantMap: Record<string, any> = {
        pending: "orange",
        in_transit: "info",
        delivered: "approved",
        cancelled: "inactive",
      };

      const labelMap: Record<string, string> = {
        pending: "Pending",
        in_transit: "In Transit",
        delivered: "Delivered",
        cancelled: "Cancelled",
      };

      return (
        <Badge
          variant={variantMap[value] || "info"}
          label={labelMap[value] || value}
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
            onClick={() => handleUpdateStatus(row)}
            disabled={row?.status === 'delivered' || row?.status === 'cancelled'}
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
      <BackHeader title="Dispatch Summary" />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            id="status-filter"
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
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
          <p className="mt-4 text-gray-600">Loading dispatch orders...</p>
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
              columns={dispatchSummaryColumns}
              data={tableData}
              renderCell={renderCell}
            />
          </div>

          {/* Empty State */}
          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">No dispatch orders found</p>
            </div>
          )}
        </>
      )}

      {/* Create Dispatch Button */}
      <div className="mt-8">
        <Button
          className="rounded-lg px-6"
          variant="primary"
          onClick={() => router.push("/warehouse/outbound/dispatch-order")}
        >
          Create Dispatch Order
        </Button>
      </div>

      {/* View Dispatch Dialog */}
      {viewDialog.isOpen && viewDialog.dispatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Dispatch Order Details</h2>
                <p className="text-orange-100 text-sm mt-1">ID: {viewDialog.dispatch.dispatchId}</p>
              </div>
              <button
                onClick={() => setViewDialog({ isOpen: false, dispatch: null })}
                className="text-white hover:bg-orange-600 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-6">
                {/* Status and Basic Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                      <Badge
                        variant={
                          viewDialog.dispatch.status === "delivered" ? "approved" :
                          viewDialog.dispatch.status === "in_transit" ? "info" :
                          viewDialog.dispatch.status === "cancelled" ? "inactive" : "orange"
                        }
                        label={viewDialog.dispatch.status.replace('_', ' ').toUpperCase()}
                        size="lg"
                        showDot={true}
                        className="inline-flex"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Assigned Agent</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">
                            {viewDialog.dispatch.assignedAgent.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">{viewDialog.dispatch.assignedAgent.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Destination
                  </h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                    <p className="text-gray-900">{viewDialog.dispatch.destination}</p>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Products ({viewDialog.dispatch.products.length})
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Product SKU
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Quantity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {viewDialog.dispatch.products.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-gray-900">{product.sku}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                {product.quantity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-700">
                            Total Items
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-orange-600">
                              {viewDialog.dispatch.products.reduce((sum, p) => sum + p.quantity, 0)}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {viewDialog.dispatch.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Notes
                    </h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-4">
                      <p className="text-gray-900 italic">{viewDialog.dispatch.notes}</p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Order Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created By</p>
                      <p className="font-semibold text-gray-900">{viewDialog.dispatch.createdBy.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{viewDialog.dispatch.createdBy.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created At</p>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(viewDialog.dispatch.createdAt), "dd MMM yyyy")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(viewDialog.dispatch.createdAt), "HH:mm:ss")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setViewDialog({ isOpen: false, dispatch: null })}
                className="rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Dialog */}
      {updateDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Update Dispatch Status</h2>
                <button
                  onClick={() => setUpdateDialog({ isOpen: false, dispatchId: null, currentStatus: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <Badge
                  variant={
                    updateDialog.currentStatus === "delivered" ? "approved" :
                    updateDialog.currentStatus === "in_transit" ? "info" :
                    updateDialog.currentStatus === "cancelled" ? "inactive" : "orange"
                  }
                  label={updateDialog.currentStatus?.replace('_', ' ').toUpperCase() || ''}
                  size="md"
                />
              </div>

              <Select
                id="new-status"
                label="New Status"
                options={updateStatusOptions}
                value={newStatus}
                onChange={(val) => setNewStatus(val as DispatchStatus)}
                selectClassName="px-4 py-2"
              />

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setUpdateDialog({ isOpen: false, dispatchId: null, currentStatus: null })}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === updateDialog.currentStatus}
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchSummary;
