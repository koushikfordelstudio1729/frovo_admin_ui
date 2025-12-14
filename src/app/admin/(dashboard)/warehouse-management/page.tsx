"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Building } from "lucide-react";
import { Button, Input, Badge, Pagination, Label } from "@/components";
import { warehouseAPI } from "@/services/warehouseAPI";
import type { Warehouse } from "@/types";
import { useRouter } from "next/navigation";

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
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  return (
    <div className="h-screen bg-gray-50 p-8 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
        <p className="text-gray-600 mt-1">Manage warehouses, locations, and capacities</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-36 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSearch}
              className="rounded-lg w-full sm:w-auto"
            >
              <Search size={16} className="mr-1.5" />
              Search
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/admin/warehouse-management/create")}
              className="rounded-lg w-full sm:w-auto whitespace-nowrap"
            >
              <Plus size={18} className="mr-2" />
              Add Warehouse
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <Building className="text-orange-500" size={40} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Loading warehouses...
                  </td>
                </tr>
              ) : warehouses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No warehouses found
                  </td>
                </tr>
              ) : (
                warehouses.map((warehouse) => (
                  <tr key={warehouse._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{warehouse.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{warehouse.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={warehouse.location}>
                        {warehouse.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {warehouse.manager ? (
                        <>
                          <div className="text-sm text-gray-900">{warehouse.manager.name}</div>
                          <div className="text-xs text-gray-500">{warehouse.manager.email}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No manager assigned</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{warehouse.capacity.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        label={warehouse.isActive ? "Active" : "Inactive"}
                        variant={warehouse.isActive ? "approved" : "rejected"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          title="View"
                          size="sm"
                          className="bg-transparent shadow-none hover:bg-gray-100"
                          onClick={() => handleView(warehouse)}
                        >
                          <Eye className="text-green-500 w-5 h-5" />
                        </Button>
                        <Button
                          title="Edit"
                          size="sm"
                          className="bg-transparent shadow-none hover:bg-gray-100"
                          onClick={() => handleEdit(warehouse)}
                        >
                          <Pencil className="text-blue-500 w-5 h-5" />
                        </Button>
                        <Button
                          title="Delete"
                          size="sm"
                          className="bg-transparent shadow-none hover:bg-gray-100"
                          onClick={() => handleDelete(warehouse)}
                        >
                          <Trash2 className="text-red-500 w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Warehouse Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Warehouse Name</Label>
                  <p className="mt-1 text-gray-900">{selectedWarehouse.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Code</Label>
                  <p className="mt-1 text-gray-900">{selectedWarehouse.code}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Partner</Label>
                <p className="mt-1 text-gray-900">{selectedWarehouse.partner}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <p className="mt-1 text-gray-900">{selectedWarehouse.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Capacity</Label>
                  <p className="mt-1 text-gray-900">{selectedWarehouse.capacity.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <p className="mt-1">
                    <Badge
                      label={selectedWarehouse.isActive ? "Active" : "Inactive"}
                      variant={selectedWarehouse.isActive ? "approved" : "rejected"}
                    />
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Manager</Label>
                <div className="mt-1">
                  {selectedWarehouse.manager ? (
                    <>
                      <p className="text-gray-900">{selectedWarehouse.manager.name}</p>
                      <p className="text-sm text-gray-500">{selectedWarehouse.manager.email}</p>
                      <p className="text-sm text-gray-500">{selectedWarehouse.manager.phone}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No manager assigned</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Created By</Label>
                <div className="mt-1">
                  <p className="text-gray-900">{selectedWarehouse.createdBy.name}</p>
                  <p className="text-sm text-gray-500">{selectedWarehouse.createdBy.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Created At</Label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedWarehouse.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Updated At</Label>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Delete Warehouse</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedWarehouse.name}</strong>? This action
              cannot be undone.
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
