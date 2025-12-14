"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Eye, X, Trash2 } from "lucide-react";
import {
  Label,
  Select,
  Input,
  Button,
  Table,
  Badge,
  Drawer
} from "@/components";
import { useFieldAgents } from "@/hooks/warehouse";
import type { FieldAgent, CreateFieldAgentPayload } from "@/types";
import { toast } from "react-hot-toast";

const fieldAgentColumns = [
  { label: "Agent Name", key: "name" },
  { label: "Assigned Routes", key: "assignedRoutes" },
  { label: "Created By", key: "created_by" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export default function AssignFieldAgentPage() {
  const router = useRouter();

  // Fetch field agents
  const {
    fieldAgents,
    loading,
    error,
    refetch,
    createFieldAgent,
    creating
  } = useFieldAgents();

  // Form state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    routes: [""],
  });

  // View dialog state
  const [viewDialog, setViewDialog] = useState<{
    isOpen: boolean;
    agent: FieldAgent | null;
  }>({
    isOpen: false,
    agent: null,
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      routes: [""],
    });
    setIsFormVisible(false);
  };

  // Add route field
  const addRoute = () => {
    setFormData({
      ...formData,
      routes: [...formData.routes, ""],
    });
  };

  // Remove route field
  const removeRoute = (index: number) => {
    if (formData.routes.length > 1) {
      setFormData({
        ...formData,
        routes: formData.routes.filter((_, i) => i !== index),
      });
    }
  };

  // Update route value
  const updateRoute = (index: number, value: string) => {
    setFormData({
      ...formData,
      routes: formData.routes.map((route, i) => (i === index ? value : route)),
    });
  };

  // Create field agent
  const handleCreateFieldAgent = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter agent name");
      return;
    }
    if (formData.routes.some(route => !route.trim())) {
      toast.error("Please fill in all route fields or remove empty ones");
      return;
    }
    if (formData.routes.length === 0) {
      toast.error("Please add at least one route");
      return;
    }

    const payload: CreateFieldAgentPayload = {
      name: formData.name,
      assignedRoutes: formData.routes.filter(route => route.trim()),
    };

    const success = await createFieldAgent(payload);
    if (success) {
      resetForm();
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedStatusFilter(statusFilter);
    const isActive = statusFilter === "true" ? true : statusFilter === "false" ? false : undefined;
    refetch({ isActive });
  };

  // Clear filters
  const clearFilters = () => {
    setStatusFilter("");
    setAppliedStatusFilter("");
    refetch({});
  };

  // Handle view
  const handleView = (agent: FieldAgent) => {
    setViewDialog({
      isOpen: true,
      agent,
    });
  };

  // Close view dialog
  const closeViewDialog = () => {
    setViewDialog({ isOpen: false, agent: null });
  };

  // Get status label
  const getStatusLabel = (value: string) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Transform data for table
  const tableData = useMemo(() => {
    return fieldAgents.map((agent) => ({
      name: agent.name,
      assignedRoutes: agent.assignedRoutes.join(", "),
      created_by: agent.createdBy?.name || "N/A",
      status: agent.isActive ? "active" : "inactive",
      _id: agent._id,
      _rawData: agent,
    }));
  }, [fieldAgents]);

  // Render cell
  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "status") {
      return (
        <Badge
          variant={value === "active" ? "approved" : "inactive"}
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          size="md"
          showDot={true}
          className="px-3 py-1 text-sm rounded-full"
        />
      );
    }

    if (key === "assignedRoutes") {
      return (
        <span className="text-sm text-gray-700" title={value}>
          {value.length > 50 ? value.substring(0, 50) + "..." : value}
        </span>
      );
    }

    if (key === "actions") {
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
        </div>
      );
    }

    return value;
  };

  const hasActiveFilters = appliedStatusFilter;

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
            Field Agent Management
          </h1>
        </div>
        <Button
          variant="primary"
          size="md"
          className="rounded-lg"
          onClick={() => setIsFormVisible(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Field Agent
        </Button>
      </div>

      {/* Create Field Agent Drawer */}
      <Drawer
        isOpen={isFormVisible}
        onClose={resetForm}
        title="Add Field Agent"
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
              onClick={handleCreateFieldAgent}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Field Agent"}
            </Button>
          </div>
        }
      >
        {/* Agent Name */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Agent Name
          </Label>
          <Input
            type="text"
            placeholder="e.g., Ramesh Kumar"
            variant="default"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Assigned Routes */}
        <div className="mb-8">
          <Label className="text-lg font-semibold text-gray-700 mb-3 block">
            Assigned Routes
          </Label>
          {formData.routes.map((route, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-10">
                <Input
                  type="text"
                  label={index === 0 ? "Route Name" : ""}
                  variant="default"
                  placeholder="e.g., Route-34"
                  value={route}
                  onChange={(e) => updateRoute(index, e.target.value)}
                />
              </div>
              <div className={`col-span-2 flex items-${index === 0 ? 'end' : 'center'}`}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeRoute(index)}
                  disabled={formData.routes.length === 1}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            className="rounded-lg mt-2"
            variant="secondary"
            size="md"
            onClick={addRoute}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Route
          </Button>
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
                    onClick={clearFilters}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    title="Remove status filter"
                    aria-label="Remove status filter"
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
          <p className="mt-4 text-gray-600">Loading field agents...</p>
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
              columns={fieldAgentColumns}
              data={tableData}
              renderCell={renderCell}
            />
          </div>

          {/* Empty State */}
          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">No field agents found</p>
            </div>
          )}
        </>
      )}

      {/* View Field Agent Dialog */}
      {viewDialog.isOpen && viewDialog.agent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Field Agent Details
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
                <Label className="text-sm font-semibold text-gray-600">Agent Name</Label>
                <p className="text-lg text-gray-900">{viewDialog.agent.name}</p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Assigned Routes
                </Label>
                <div className="space-y-2">
                  {viewDialog.agent.assignedRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <p className="text-sm text-gray-900">{route}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">Status</Label>
                <Badge
                  variant={viewDialog.agent.isActive ? "approved" : "inactive"}
                  label={viewDialog.agent.isActive ? "Active" : "Inactive"}
                  size="md"
                  showDot={true}
                  className="px-3 py-1 text-sm rounded-full"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Created By</Label>
                    <p className="text-gray-900">{viewDialog.agent.createdBy?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Created At</Label>
                    <p className="text-gray-900">
                      {new Date(viewDialog.agent.createdAt).toLocaleDateString()}
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
    </div>
  );
}
