"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Edit, Trash2, Plus, X } from "lucide-react";
import {
  Label,
  Select,
  Input,
  Button,
  Table,
  Badge,
  ConfirmDialog,
  Drawer,
  Pagination,
  SearchableSelect,
  BackHeader,
} from "@/components";
import {
  useQCTemplates,
  usePurchaseOrders,
  useMyWarehouse,
} from "@/hooks/warehouse";
import type { QCTemplate, CreateQCTemplatePayload } from "@/types";

interface Parameter {
  id: string;
  name: string;
  value: string;
}

interface QCTemplateFormData {
  title: string;
  sku: string;
  parameters: Parameter[];
}

const qcTemplateColumns = [
  { label: "Template Title", key: "title" },
  { label: "SKU", key: "sku" },
  { label: "Parameters", key: "parameters_count" },
  { label: "Created By", key: "created_by" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

export default function QCChecklistTemplatesPage() {
  const router = useRouter();

  // Get warehouse ID
  const { warehouse } = useMyWarehouse();

  const {
    qcTemplates,
    loading,
    error,
    refetch,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    creating,
    updating,
    deleting,
  } = useQCTemplates();

  const { purchaseOrders } = usePurchaseOrders({
    warehouseId: warehouse?._id,
  });

  // Form state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<QCTemplate | null>(
    null
  );
  const [formData, setFormData] = useState<QCTemplateFormData>({
    title: "",
    sku: "",
    parameters: [{ id: "1", name: "", value: "" }],
  });

  // View dialog state
  const [viewDialog, setViewDialog] = useState<{
    isOpen: boolean;
    template: QCTemplate | null;
  }>({
    isOpen: false,
    template: null,
  });

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Filters
  const [skuFilter, setSkuFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const hasActiveFilters = !!skuFilter || !!searchTerm;

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Get unique SKUs from purchase orders
  const skuOptions = useMemo(() => {
    const uniqueSkus = new Set<string>();
    purchaseOrders.forEach((po) => {
      po.po_line_items.forEach((item) => {
        if (item.sku) uniqueSkus.add(item.sku);
      });
    });

    return Array.from(uniqueSkus).map((sku) => ({
      label: sku,
      value: sku,
    }));
  }, [purchaseOrders]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      sku: "",
      parameters: [{ id: "1", name: "", value: "" }],
    });
    setEditingTemplate(null);
    setIsFormVisible(false);
  };

  // Load template data for editing
  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        title: editingTemplate.title,
        sku: editingTemplate.sku,
        parameters: editingTemplate.parameters.map((param, index) => ({
          id: param._id || Date.now().toString() + index,
          name: param.name,
          value: param.value,
        })),
      });
      setIsFormVisible(true);
    }
  }, [editingTemplate]);

  // Parameter operations
  const addParameter = () => {
    setFormData({
      ...formData,
      parameters: [
        ...formData.parameters,
        { id: Date.now().toString(), name: "", value: "" },
      ],
    });
  };

  const removeParameter = (id: string) => {
    if (formData.parameters.length > 1) {
      setFormData({
        ...formData,
        parameters: formData.parameters.filter((p) => p.id !== id),
      });
    }
  };

  const updateParameter = (
    id: string,
    field: "name" | "value",
    val: string
  ) => {
    setFormData({
      ...formData,
      parameters: formData.parameters.map((p) =>
        p.id === id ? { ...p, [field]: val } : p
      ),
    });
  };

  // Save template (create or update)
  const handleSaveTemplate = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a template title");
      return;
    }
    if (!formData.sku) {
      alert("Please select a SKU");
      return;
    }
    if (formData.parameters.some((p) => !p.name.trim() || !p.value.trim())) {
      alert("Please fill in all parameter names and values");
      return;
    }

    const payload: CreateQCTemplatePayload = {
      title: formData.title,
      sku: formData.sku,
      parameters: formData.parameters.map((p) => ({
        name: p.name,
        value: p.value,
      })),
    };

    let success = false;
    if (editingTemplate) {
      success = await updateTemplate(editingTemplate._id, payload);
    } else {
      success = await createTemplate(payload);
    }

    if (success) {
      resetForm();
      refetch();
    }
  };

  const handleEdit = (template: QCTemplate) => {
    setEditingTemplate(template);
  };

  const handleDelete = (template: QCTemplate) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete QC Template",
      message: `Are you sure you want to delete the template "${template.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        await deleteTemplate(template._id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleView = (template: QCTemplate) => {
    setViewDialog({ isOpen: true, template });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const closeViewDialog = () => {
    setViewDialog({ isOpen: false, template: null });
  };

  const handleSkuFilterChange = (val: string) => {
    setSkuFilter(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSkuFilter = () => {
    setSkuFilter("");
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSkuFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Filter templates by SKU and search
  const filteredTemplates = useMemo(() => {
    let data = qcTemplates;

    if (skuFilter) {
      data = data.filter((template) => template.sku === skuFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (template) =>
          template.title.toLowerCase().includes(term) ||
          template.sku.toLowerCase().includes(term)
      );
    }

    return data;
  }, [qcTemplates, skuFilter, searchTerm]);

  // Transform data for table
  const tableData = useMemo(
    () =>
      filteredTemplates.map((template) => ({
        title: template.title,
        sku: template.sku,
        parameters_count: template.parameters.length,
        created_by: template.createdBy?.name || "N/A",
        status: template.isActive ? "active" : "inactive",
        _id: template._id,
        _rawData: template,
      })),
    [filteredTemplates]
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(tableData.length / pageSize));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, currentPage, pageSize]);

  const handlePageChange = (page: number) => setCurrentPage(page);

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
          <Button
            title="Edit"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleEdit(row?._rawData)}
            disabled={updating}
          >
            <Edit className="text-blue-500 w-5 h-5" />
          </Button>
          <Button
            title="Delete"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100 p-2"
            onClick={() => handleDelete(row?._rawData)}
            disabled={deleting}
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </Button>
        </div>
      );
    }

    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 my-4">
        <BackHeader title="QC Checklist template" />
        <Button
          variant="primary"
          size="md"
          className="rounded-lg"
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Form Drawer */}
      <Drawer
        isOpen={isFormVisible}
        onClose={resetForm}
        title={editingTemplate ? "Edit Template" : "Create New Template"}
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
              onClick={handleSaveTemplate}
              disabled={creating || updating}
            >
              {creating || updating
                ? "Saving..."
                : editingTemplate
                ? "Update Template"
                : "Save Template"}
            </Button>
          </div>
        }
      >
        {/* Template Title */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Template Title
          </Label>
          <Input
            type="text"
            placeholder="e.g., Perishable Items QC"
            variant="orange"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* SKU Selection */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            SKU
          </Label>
          <SearchableSelect
            id="sku"
            label={undefined}
            value={formData.sku}
            options={skuOptions}
            placeholder="Search or select SKU"
            variant="orange"
            fullWidth
            selectClassName="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg"
            onChange={(val) => setFormData({ ...formData, sku: val })}
          />
        </div>

        {/* Add Parameter Section */}
        <div className="mb-8">
          <Label className="text-lg font-semibold text-gray-700 mb-3 block">
            Quality Check Parameters
          </Label>
          {formData.parameters.map((param, index) => (
            <div key={param.id} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-5">
                <Input
                  type="text"
                  label={index === 0 ? "Parameter Name" : ""}
                  variant="orange"
                  placeholder="e.g., Packaging Intact"
                  value={param.name}
                  onChange={(e) =>
                    updateParameter(param.id, "name", e.target.value)
                  }
                />
              </div>
              <div className="col-span-5">
                <Input
                  type="text"
                  label={index === 0 ? "Expected Value" : ""}
                  placeholder="e.g., Yes"
                  variant="orange"
                  value={param.value}
                  onChange={(e) =>
                    updateParameter(param.id, "value", e.target.value)
                  }
                />
              </div>
              <div
                className={`col-span-2 flex items-${
                  index === 0 ? "end" : "center"
                }`}
              >
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeParameter(param.id)}
                  disabled={formData.parameters.length === 1}
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
            onClick={addParameter}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Parameter
          </Button>
        </div>
      </Drawer>

      {/* Filter + Search Section */}
      <div className="pt-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Input
            id="search"
            label="Search title & SKU"
            placeholder="Search by template title or SKU"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="default"
          />
          <div className="flex items-end">
            {hasActiveFilters && (
              <div>
                <Button
                  onClick={clearAllFilters}
                  variant="secondary"
                  className="rounded-lg w-full"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Active Filters:
              </span>

              {skuFilter && (
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">SKU: {skuFilter}</span>
                  <button
                    onClick={clearSkuFilter}
                    className="ml-1 hover:bg-orange-200 rounded-full p-1 transition-colors"
                    title="Remove SKU filter"
                    aria-label="Remove SKU filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {searchTerm && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <span className="font-medium text-sm">
                    Search: {searchTerm}
                  </span>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
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
          <p className="mt-4 text-gray-600">Loading QC templates...</p>
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

      {/* Table + Pagination */}
      {!loading && !error && (
        <>
          <div className="mt-6">
            <Table
              columns={qcTemplateColumns}
              data={paginatedData}
              renderCell={renderCell}
            />
          </div>

          {tableData.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <p className="text-gray-500">
                {skuFilter || searchTerm
                  ? "No templates found for these filters"
                  : "No QC templates found. Create your first template!"}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* View Template Dialog */}
      {viewDialog.isOpen && viewDialog.template && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeViewDialog}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Template Details
              </h2>
              <button
                onClick={closeViewDialog}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-gray-700 cursor-pointer" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-600">
                  Title
                </Label>
                <p className="text-lg text-gray-900">
                  {viewDialog.template.title}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">
                  SKU
                </Label>
                <p className="text-lg text-gray-900">
                  {viewDialog.template.sku}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">
                  Status:
                </Label>
                <Badge
                  variant={
                    viewDialog.template.isActive ? "approved" : "inactive"
                  }
                  label={viewDialog.template.isActive ? "Active" : "Inactive"}
                  size="md"
                  showDot={true}
                  className="px-3 mx-4 py-1 text-sm rounded-full"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Quality Check Parameters
                </Label>
                <div className="space-y-2">
                  {viewDialog.template.parameters.map((param, index) => (
                    <div
                      key={param._id || index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-gray-600">
                            Parameter
                          </span>
                          <p className="text-sm text-gray-900">{param.name}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-600">
                            Expected Value
                          </span>
                          <p className="text-sm text-gray-900">{param.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">
                      Created By
                    </Label>
                    <p className="text-gray-900">
                      {viewDialog.template.createdBy?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">
                      Created At
                    </Label>
                    <p className="text-gray-900">
                      {new Date(
                        viewDialog.template.createdAt
                      ).toLocaleDateString()}
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
              <Button
                variant="primary"
                size="md"
                className="rounded-lg"
                onClick={() => {
                  const tmpl = viewDialog.template!;
                  closeViewDialog();
                  handleEdit(tmpl);
                }}
              >
                Edit Template
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
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        isLoading={deleting}
      />
    </div>
  );
}
