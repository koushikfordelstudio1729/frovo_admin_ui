"use client";

import { Badge, Button, Input, Label, Pagination, Table } from "@/components";
import { Eye, Edit2, Trash2, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { routeAPI } from "@/services/routeAPI";
import { RouteData } from "@/types/route.types";
import { toast } from "react-hot-toast";

const routeTableColumns = [
  { label: "Route Name", key: "route_name" },
  { label: "Area", key: "area_name" },
  { label: "Machines", key: "machine_count" },
  { label: "Frequency", key: "frequency_type" },
  { label: "Description", key: "route_description" },
  { label: "Actions", key: "actions" },
];

const renderRouteCell = (
  key: string,
  value: any,
  row?: Record<string, any>,
  onView?: (id: string) => void,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void
) => {
  if (key === "area_name") {
    return row?.area_name?.area_name || "N/A";
  }

  if (key === "frequency_type") {
    const frequency = value as string;
    let variant: "active" | "inactive" | "pending" = "pending";

    if (frequency === "daily") variant = "active";
    else if (frequency === "weekly") variant = "pending";
    else variant = "inactive";

    return (
      <Badge
        label={frequency?.charAt(0).toUpperCase() + frequency?.slice(1) || "N/A"}
        variant={variant}
        size="md"
        showDot
        className="px-6 py-2 text-sm"
      />
    );
  }

  if (key === "machine_count") {
    return `${value || 0} Machines`;
  }

  if (key === "route_description") {
    return (
      <span className="max-w-xs truncate block" title={value}>
        {value || "N/A"}
      </span>
    );
  }

  if (key === "actions") {
    const routeId = row?._id;
    return (
      <div className="flex items-center gap-3">
        <button
          className="text-green-500"
          type="button"
          onClick={() => onView?.(routeId)}
          title="View Details"
        >
          <Eye size={18} />
        </button>
        <button
          className="text-blue-500"
          type="button"
          onClick={() => onEdit?.(routeId)}
          title="Edit Route"
        >
          <Edit2 size={18} />
        </button>
        <button
          className="text-red-500"
          type="button"
          onClick={() => onDelete?.(routeId)}
          title="Delete Route"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return value;
};

const RoutePlanning = () => {
  const router = useRouter();
  const Create_Route = "/route/route-planning/create-route";
  const [currentPage, setCurrentPage] = useState(1);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteRouteId, setDeleteRouteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const pageSize = 10;

  // Fetch routes
  const fetchRoutes = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await routeAPI.getAllRoutes(page, pageSize);

      if (response.success) {
        setRoutes(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      }
    } catch (error: any) {
      console.error("Error fetching routes:", error);
      toast.error(error.response?.data?.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  // Load routes on mount and page change
  useEffect(() => {
    fetchRoutes(currentPage);
  }, [currentPage]);

  // Filter routes based on search
  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return routes;

    return routes.filter((route) =>
      route.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.area_name?.area_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.route_description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [routes, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (id: string) => {
    router.push(`/route/route-planning/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/route/route-planning/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteRouteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRouteId) return;

    try {
      setDeleting(true);
      const response = await routeAPI.deleteRoute(deleteRouteId);
      if (response.success) {
        toast.success("Route deleted successfully");
        fetchRoutes(currentPage); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Failed to delete route");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteRouteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeleteRouteId(null);
  };

  return (
    <div className="min-h-screen pt-12">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          <div>
            <Input
              label="Search"
              variant="search"
              labelClassName="text-xl"
              placeholder="Search routes, areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search size={18} />}
            />
          </div>
        </div>

        <Button
          className="px-8 h-11 rounded-lg shrink-0"
          variant="primary"
          onClick={() => router.push(Create_Route)}
        >
          + Add Route
        </Button>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Label className="text-xl">Route Listing</Label>
        <span className="text-sm text-gray-500">
          {totalCount} route{totalCount !== 1 ? "s" : ""} found
        </span>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading routes...</div>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">
              {searchQuery ? "No routes found matching your search" : "No routes available"}
            </div>
          </div>
        ) : (
          <Table
            columns={routeTableColumns}
            data={filteredRoutes}
            renderCell={(key, value, row) =>
              renderRouteCell(key, value, row, handleView, handleEdit, handleDelete)
            }
          />
        )}
      </div>

      {!loading && filteredRoutes.length > 0 && (
        <div className="mt-2 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Route
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this route? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    className="rounded-lg px-6"
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-lg px-6 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanning;
