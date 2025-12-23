"use client";

import { JSX, useState, useEffect } from "react";
import { Plus, Search, Edit3, Trash2, Eye, Package, CheckCircle, XCircle } from "lucide-react";

import {
  Input,
  Button,
  Toggle,
  ConfirmDialog,
  Pagination,
  Label,
  StatCard,
  Select,
} from "@/components";
import Table, { Column } from "@/components/name&table/Table";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

type Sku = {
  _id: string;
  sku_id: string;
  product_name: string;
  brand_name: string;
  category: string;
  sub_category: string;
  unit_size: string;
  base_price: number;
  final_price: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

const columns: Column[] = [
  { key: "sku_id", label: "SKU ID" },
  { key: "product_name", label: "Product Name" },
  { key: "brand_name", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "sub_category", label: "Sub Category" },
  { key: "unit_size", label: "Unit size" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created at" },
  { key: "actions", label: "Actions" },
];

const SkuMaster = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [skus, setSkus] = useState<Sku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const pageSize = 10;

  // confirm‑toggle state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pendingSkuId, setPendingSkuId] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSkuId, setDeleteSkuId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  // Fetch catalogues from API
  const fetchCatalogues = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sort_by: "product_name",
        sort_order: "asc",
      });

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const response = await api.get(
        `${apiConfig.endpoints.catalogue.catalogues}?${params.toString()}`
      );

      if (response.data.success) {
        setSkus(response.data.data.products);
        setTotal(response.data.data.total);
        setTotalPages(response.data.data.totalPages);

        // Calculate active/inactive counts
        const active = response.data.data.products.filter((sku: Sku) => sku.status === "active").length;
        const inactive = response.data.data.products.filter((sku: Sku) => sku.status === "inactive").length;
        setActiveCount(active);
        setInactiveCount(inactive);
      }
    } catch (err: any) {
      console.error("Error fetching catalogues:", err);
      setError("Failed to load catalogues. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch catalogues on mount and when filters change
  useEffect(() => {
    fetchCatalogues();
  }, [page, statusFilter]);

  const handleAddSku = () => {
    router.push("/catalogue/sku-master/create-edit-sku");
  };

  const handleConfirmDelete = async () => {
    if (!deleteSkuId) return;

    try {
      setDeleteLoading(true);

      await api.delete(
        apiConfig.endpoints.catalogue.deleteCatalogue(deleteSkuId)
      );

      // Refresh the list after successful deletion
      await fetchCatalogues();

      setDeleteOpen(false);
      setDeleteSkuId(null);
    } catch (err: any) {
      console.error("Error deleting catalogue:", err);
      setError("Failed to delete catalogue. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteOpen(false);
    setDeleteSkuId(null);
  };

  const handleViewSku = (sku: Sku) => {
    router.push(`/catalogue/sku-master/view-sku?id=${sku._id}`);
  };

  const handleEditSku = (sku: Sku) => {
    router.push(`/catalogue/sku-master/create-edit-sku?id=${sku._id}`);
  };

  const openConfirmForSku = (skuId: string, next: boolean) => {
    setPendingSkuId(skuId);
    setPendingValue(next);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingSkuId || pendingValue === null) return;

    setConfirmLoading(true);

    try {
      // Call API to update catalogue status
      await api.patch(
        apiConfig.endpoints.catalogue.updateCatalogueStatus(pendingSkuId),
        {
          status: pendingValue ? "active" : "inactive",
        }
      );

      // Refresh the list after successful update
      await fetchCatalogues();
    } catch (error) {
      console.error("Error updating catalogue status:", error);
      setError("Failed to update catalogue status. Please try again.");
    }

    setConfirmLoading(false);
    setConfirmOpen(false);
    setPendingSkuId(null);
    setPendingValue(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingSkuId(null);
    setPendingValue(null);
  };

  // Client-side search filter (applied after API data is fetched)
  const filteredSkus = skus.filter((sku) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      sku.sku_id.toLowerCase().includes(q) ||
      sku.product_name.toLowerCase().includes(q) ||
      sku.brand_name.toLowerCase().includes(q) ||
      sku.category.toLowerCase().includes(q)
    );
  });

  const openDeleteDialog = (skuId: string) => {
    setDeleteSkuId(skuId);
    setDeleteOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const tableData: Record<string, any>[] = filteredSkus.map((sku) => ({
    ...sku,
    price: `₹${sku.final_price}`,
    createdAt: formatDate(sku.createdAt),
    status: sku.status === "active",
    actions: "actions",
  }));

  type RenderCellFn = (
    key: string,
    value: any,
    row?: Record<string, any>
  ) => JSX.Element;

  const skuRenderCell: RenderCellFn = (key, value, row) => {
    if (!row) return value as JSX.Element;

    const sku = row as Sku & { status: boolean };

    if (key === "status") {
      return (
        <Toggle
          enabled={sku.status === "active" || sku.status === true}
          onChange={(next) => openConfirmForSku(sku._id, next)}
        />
      );
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-3">
          {/* View */}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => handleViewSku(sku)}
          >
            <Eye size={16} />
          </button>

          {/* Edit */}
          <button
            type="button"
            className="text-green-500 hover:text-green-600 cursor-pointer"
            onClick={() => handleEditSku(sku)}
          >
            <Edit3 size={16} />
          </button>

          {/* Delete */}
          <button
            type="button"
            className="text-red-500 hover:text-red-600 cursor-pointer"
            onClick={() => openDeleteDialog(sku._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }

    return value as JSX.Element;
  };

  return (
    <div className="min-h-full pt-8 w-full overflow-x-auto">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <StatCard
          title="Total SKUs"
          count={total}
          icon={Package}
        />
        <StatCard
          title="Active SKUs"
          count={activeCount}
          icon={CheckCircle}
        />
        <StatCard
          title="Inactive SKUs"
          count={inactiveCount}
          icon={XCircle}
        />
      </div>

      {/* top controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex gap-4 flex-wrap">
          <Input
            label="Search"
            placeholder="Search SKUs"
            labelClassName="text-xl"
            variant="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Search size={16} />}
          />
          <div>
            <Select
              label="Status Filter"
              selectClassName="py-2 px-4"
              value={statusFilter}
              options={[
                { value: "", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1); // Reset to first page when filter changes
              }}
            />
          </div>
        </div>
      </div>

      {/* table section */}
      <div>
        <div className="flex items-center justify-between pb-4">
          <Label className="text-xl font-semibold">SKU Summary Table</Label>
          <div className="flex gap-4">
            <Button className="rounded-lg" onClick={handleAddSku}>
              <Plus size={18} className="mr-2" /> Create New SKU
            </Button>
            <Button variant="secondary" className="rounded-lg">
              Export SKUs
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-xl text-gray-600">Loading catalogues...</div>
            </div>
          ) : tableData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-xl text-gray-500">No catalogues found</div>
            </div>
          ) : (
            <div className="min-w-[1200px]">
              <Table
                columns={columns}
                data={tableData}
                renderCell={skuRenderCell}
                minTableWidth="1600px"
              />
            </div>
          )}
        </div>

        <div className="p-4 flex justify-end border-t">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(next) => {
              if (next < 1 || next > totalPages) return;
              setPage(next);
            }}
          />
        </div>
      </div>

      {/* confirm dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Change SKU status?"
        message={
          pendingValue === null ? (
            ""
          ) : (
            <span>
              Are you sure you want to mark this SKU as{" "}
              <span
                className={
                  pendingValue
                    ? "font-semibold text-green-600"
                    : "font-semibold text-red-600"
                }
              >
                {pendingValue ? "Active" : "Inactive"}
              </span>
              ?
            </span>
          )
        }
        confirmText="Yes, change"
        cancelText="No"
        confirmVariant={pendingValue === false ? "danger" : "primary"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={confirmLoading}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete SKU?"
        message={
          deleteSkuId ? (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">{deleteSkuId}</span>?
              This action cannot be undone.
            </span>
          ) : (
            ""
          )
        }
        confirmText="Yes, delete"
        cancelText="No"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default SkuMaster;
