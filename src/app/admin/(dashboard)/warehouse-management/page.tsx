"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Building } from "lucide-react";
import {
  Button,
  Input,
  Badge,
  Pagination,
  Label,
  Table,
  BackHeader,
  StatCard,
  Select,
} from "@/components";
import { warehouseAPI } from "@/services/warehouseAPI";
import type { Warehouse } from "@/types";
import { useRouter } from "next/navigation";
import type { Column } from "@/components";

export default function WarehouseManagementPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  // always 10 items per page
  const ITEMS_PER_PAGE = 10;

  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (statusFilter !== "all") {
        params.isActive = statusFilter === "active";
      }

      const response = await warehouseAPI.getWarehouses(params);

      if (response.data.success) {
        setWarehouses(response.data.data.warehouses);
        setTotalPages(response.data.data.pagination.pages);
        setTotal(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchWarehouses();
  };

  const handleView = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowViewModal(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    router.push(`/admin/warehouse-management/edit/${warehouse._id}`);
  };

  const handleDelete = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedWarehouse) return;

    try {
      setDeleteLoading(true);
      await warehouseAPI.deleteWarehouse(selectedWarehouse._id);
      setShowDeleteModal(false);
      setSelectedWarehouse(null);
      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (warehouse: Warehouse) => {
    try {
      if (warehouse.isActive) {
        await warehouseAPI.deactivateWarehouse(warehouse._id);
      } else {
        await warehouseAPI.activateWarehouse(warehouse._id);
      }
      fetchWarehouses();
    } catch (error) {
      console.error("Error toggling warehouse status:", error);
    }
  };

  // Table config
  const columns: Column[] = [
    { key: "code", label: "Code", minWidth: "140px", className: "text-left" },
    {
      key: "location",
      label: "Location",
      minWidth: "260px",
      className: "text-left",
    },
    {
      key: "manager",
      label: "Manager",
      minWidth: "260px",
      className: "text-left",
    },
    { key: "capacity", label: "Capacity", minWidth: "140px" },
    { key: "status", label: "Status", minWidth: "140px" },
    { key: "actions", label: "Actions", minWidth: "180px" },
  ];

  const tableData = warehouses.map((w) => ({
    id: w._id,
    code: w.code,
    location: w.location,
    manager: w.manager,
    capacity: w.capacity,
    status: w.isActive,
    actions: w,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <BackHeader title="Warehosue Management" />
      <div className="w-xs mb-4">
        <StatCard title="Total Warehouse" count={total} icon={Building} />
      </div>
      {/* Search and Filters */}
      <div className="mb-6 shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                startIcon={<Search size={20} />}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              placeholder="Select status"
              fullWidth={false}
              variant="default"
              selectClassName="px-4 py-3 text-sm bg-white"
              className="w-full sm:w-36"
            />

            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/admin/warehouse-management/create")}
              className="rounded-lg"
            >
              <Plus size={18} className="mr-2" />
              Add Warehouse
            </Button>
          </div>
        </div>
      </div>

      {/* Table + Pagination */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
            Loading warehouses...
          </div>
        ) : warehouses.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
            No warehouses found
          </div>
        ) : (
          <>
            {/* full table, horizontal scroll if needed, no vertical clipping */}
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={tableData}
                enableHorizontalScroll
                minTableWidth="1000px"
                alternateRowColors
                showSeparators
                renderCell={(key, value, row) => {
                  const w = row?.actions as Warehouse;

                  switch (key) {
                    case "code":
                      return (
                        <div className="text-left text-sm font-medium text-gray-900">
                          {value}
                        </div>
                      );
                    case "location":
                      return (
                        <div
                          className="text-left text-sm text-gray-900 max-w-xs truncate"
                          title={value as string}
                        >
                          {value}
                        </div>
                      );
                    case "manager":
                      return w.manager ? (
                        <div className="text-left">
                          <div className="text-sm text-gray-900">
                            {w.manager.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {w.manager.email}
                          </div>
                        </div>
                      ) : (
                        <div className="text-left text-sm text-gray-500 italic">
                          No manager assigned
                        </div>
                      );
                    case "capacity":
                      return (
                        <span className="text-sm text-gray-900">
                          {Number(value).toLocaleString()}
                        </span>
                      );
                    case "status":
                      return (
                        <Badge
                          label={value ? "Active" : "Inactive"}
                          variant={value ? "approved" : "rejected"}
                        />
                      );
                    case "actions":
                      return (
                        <div className="flex items-center gap-3 justify-center">
                          <Button
                            title="View"
                            size="sm"
                            className="bg-transparent shadow-none hover:bg-gray-100"
                            onClick={() => handleView(w)}
                          >
                            <Eye className="text-green-500 w-5 h-5" />
                          </Button>
                          <Button
                            title="Edit"
                            size="sm"
                            className="bg-transparent shadow-none hover:bg-gray-100"
                            onClick={() => handleEdit(w)}
                          >
                            <Pencil className="text-blue-500 w-5 h-5" />
                          </Button>
                          <Button
                            title="Delete"
                            size="sm"
                            className="bg-transparent shadow-none hover:bg-gray-100"
                            onClick={() => handleDelete(w)}
                          >
                            <Trash2 className="text-red-500 w-5 h-5" />
                          </Button>
                        </div>
                      );
                    default:
                      return value;
                  }
                }}
              />
            </div>
          </>
        )}
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedWarehouse && (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Warehouse Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Warehouse Name
                  </Label>
                  <p className="mt-1 text-gray-900">{selectedWarehouse.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Code
                  </Label>
                  <p className="mt-1 text-gray-900">{selectedWarehouse.code}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Partner
                </Label>
                <p className="mt-1 text-gray-900">
                  {selectedWarehouse.partner}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Location
                </Label>
                <p className="mt-1 text-gray-900">
                  {selectedWarehouse.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Capacity
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedWarehouse.capacity.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <p className="mt-1">
                    <Badge
                      label={selectedWarehouse.isActive ? "Active" : "Inactive"}
                      variant={
                        selectedWarehouse.isActive ? "approved" : "rejected"
                      }
                    />
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Manager
                </Label>
                <div className="mt-1">
                  {selectedWarehouse.manager ? (
                    <>
                      <p className="text-gray-900">
                        {selectedWarehouse.manager.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedWarehouse.manager.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedWarehouse.manager.phone}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No manager assigned</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Created By
                </Label>
                <div className="mt-1">
                  <p className="text-gray-900">
                    {selectedWarehouse.createdBy.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedWarehouse.createdBy.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Created At
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedWarehouse.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Updated At
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedWarehouse.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button
                variant="secondary"
                onClick={() => handleToggleStatus(selectedWarehouse)}
                className="rounded-lg"
              >
                {selectedWarehouse.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowViewModal(false)}
                className="rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedWarehouse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Delete Warehouse
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedWarehouse.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedWarehouse(null);
                }}
                disabled={deleteLoading}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmDelete}
                isLoading={deleteLoading}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
