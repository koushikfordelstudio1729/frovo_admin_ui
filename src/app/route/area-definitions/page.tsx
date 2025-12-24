"use client";

import {
  Badge,
  Button,
  ConfirmationModal,
  Input,
  Label,
  Pagination,
  Select,
  Table,
} from "@/components";
import { Eye, Edit2, ToggleLeft, ToggleRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { areaAPI } from "@/services/areaAPI";
import type { Area } from "@/types";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const areaTableColumns = [
  { label: "Area Name", key: "area_name" },
  { label: "Machines Assigned", key: "total_machines" },
  { label: "Description", key: "area_description" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

const AreaDefinitions = () => {
  const router = useRouter();
  const Create_Area = "/route/area-definitions/create-area";

  const [areas, setAreas] = useState<Area[]>([]);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const pageSize = 10;

  // Fetch areas
  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (status) {
        params.status = status as "active" | "inactive";
      }

      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      const response = await areaAPI.getAreas(params);

      if (response.success) {
        setAreas(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      alert("Failed to fetch areas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [currentPage, status]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAreas();
  };

  const handleViewArea = (areaId: string) => {
    router.push(`/route/area-definitions/${areaId}`);
  };

  const handleEditArea = (areaId: string) => {
    router.push(`/route/area-definitions/edit/${areaId}`);
  };

  const handleToggleStatusClick = (area: Area) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!selectedArea) return;

    try {
      setIsTogglingStatus(true);
      const newStatus = selectedArea.status === "active" ? "inactive" : "active";

      const response = await areaAPI.updateArea(selectedArea._id, {
        status: newStatus,
      });

      if (response.success) {
        setIsModalOpen(false);
        setSelectedArea(null);
        fetchAreas(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error toggling area status:", error);
      alert(error?.response?.data?.message || "Failed to toggle area status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleCloseModal = () => {
    if (!isTogglingStatus) {
      setIsModalOpen(false);
      setSelectedArea(null);
    }
  };

  // Render function for table cells
  const renderAreaCell = (key: string, value: any, row?: Area) => {
    if (key === "status") {
      const status = (row?.status as string) || "";
      const variant = status === "active" ? "active" : "inactive";

      return (
        <Badge
          label={status === "active" ? "Active" : "Inactive"}
          variant={variant}
          size="md"
          showDot
          className="px-6 py-2 text-sm"
        />
      );
    }

    if (key === "actions" && row) {
      const isActive = row.status === "active";
      return (
        <div className="flex items-center gap-3">
          <button
            className="text-green-500 hover:text-green-700 transition-colors"
            type="button"
            onClick={() => handleViewArea(row._id)}
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            type="button"
            onClick={() => handleEditArea(row._id)}
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            className={`transition-colors ${
              isActive
                ? "text-orange-500 hover:text-orange-700"
                : "text-green-500 hover:text-green-700"
            }`}
            type="button"
            onClick={() => handleToggleStatusClick(row)}
            title={isActive ? "Deactivate" : "Activate"}
          >
            {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
        </div>
      );
    }

    if (key === "area_description" && value) {
      return value.length > 50 ? value.substring(0, 50) + "..." : value;
    }

    return value || "-";
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
              placeholder="Search areas..."
              startIcon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>

          <div>
            <Select
              label="Status"
              placeholder="All"
              selectClassName="py-2 px-4"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />
          </div>

          <Button
            className="px-6 h-11 rounded-lg"
            variant="secondary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        <Button
          className="px-8 h-11 rounded-lg shrink-0"
          variant="primary"
          onClick={() => router.push(Create_Area)}
        >
          + Add Area
        </Button>
      </div>

      <div className="mt-10">
        <Label className="text-xl">
          Area Table {isLoading && "(Loading...)"}
        </Label>
      </div>

      <div className="mt-4">
        {areas.length === 0 && !isLoading ? (
          <div className="text-center py-10 text-gray-500">
            No areas found. Create one to get started.
          </div>
        ) : (
          <Table
            columns={areaTableColumns}
            data={areas}
            renderCell={renderAreaCell}
          />
        )}
      </div>
      {totalPages > 1 && (
        <div className="mt-2 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleToggleStatus}
        title={
          selectedArea?.status === "active"
            ? "Deactivate Area"
            : "Activate Area"
        }
        message={
          selectedArea?.status === "active"
            ? `Are you sure you want to deactivate "${selectedArea?.area_name}"? This will change its status to inactive.`
            : `Are you sure you want to activate "${selectedArea?.area_name}"? This will change its status to active.`
        }
        confirmText={selectedArea?.status === "active" ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        isLoading={isTogglingStatus}
        variant={selectedArea?.status === "active" ? "warning" : "info"}
      />
    </div>
  );
};

export default AreaDefinitions;
