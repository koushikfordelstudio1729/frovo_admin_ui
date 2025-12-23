"use client";

import { JSX, useState } from "react";
import { Plus, Search, Edit3, Trash2, Eye } from "lucide-react";

import {
  Input,
  Button,
  Toggle,
  ConfirmDialog,
  Pagination,
  Label,
} from "@/components";
import Table, { Column } from "@/components/name&table/Table";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

type Sku = {
  id: string;
  productName: string;
  brand: string;
  category: string;
  storageType: string;
  unitSize: string;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const initialSkus: Sku[] = [
  {
    id: "SKU-001",
    productName: "Amul Toned Milk",
    brand: "Amul",
    category: "Dairy",
    storageType: "Refrigerated",
    unitSize: "500ml",
    price: "₹50",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-002",
    productName: "Coca-Cola",
    brand: "Coca-Cola",
    category: "Beverages",
    storageType: "Ambient",
    unitSize: "1L",
    price: "₹85",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-003",
    productName: "Lay's Classic Salted",
    brand: "Lay's",
    category: "Snacks",
    storageType: "Ambient",
    unitSize: "52g",
    price: "₹20",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-004",
    productName: "Maggi 2-Minute Noodles",
    brand: "Maggi",
    category: "Instant Foods",
    storageType: "Ambient",
    unitSize: "70g",
    price: "₹15",
    isActive: false,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-005",
    productName: "Fortune Sunflower Oil",
    brand: "Fortune",
    category: "Cooking Essentials",
    storageType: "Ambient",
    unitSize: "1L",
    price: "₹160",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-006",
    productName: "Tata Salt",
    brand: "Tata",
    category: "Cooking Essentials",
    storageType: "Ambient",
    unitSize: "1kg",
    price: "₹28",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-007",
    productName: "Bournvita Health Drink",
    brand: "Cadbury",
    category: "Beverages",
    storageType: "Ambient",
    unitSize: "500g",
    price: "₹230",
    isActive: false,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-008",
    productName: "Britannia Marie Gold",
    brand: "Britannia",
    category: "Biscuits",
    storageType: "Ambient",
    unitSize: "200g",
    price: "₹35",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-009",
    productName: "Mother Dairy Curd",
    brand: "Mother Dairy",
    category: "Dairy",
    storageType: "Refrigerated",
    unitSize: "400g",
    price: "₹60",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
  {
    id: "SKU-010",
    productName: "Paper Boat Aam Panna",
    brand: "Paper Boat",
    category: "Beverages",
    storageType: "Ambient",
    unitSize: "600ml",
    price: "₹45",
    isActive: true,
    createdAt: "24-11-2025",
    updatedAt: "18-11-2025",
  },
];

const columns: Column[] = [
  { key: "id", label: "SKU ID" },
  { key: "productName", label: "Product Name" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "storageType", label: "Storage Type" },
  { key: "unitSize", label: "Unit size" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created at" },
  { key: "updatedAt", label: "Last updated" },
  { key: "actions", label: "Actions" },
];

const SkuMaster = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [skus, setSkus] = useState<Sku[]>(initialSkus);

  // confirm‑toggle state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pendingSkuId, setPendingSkuId] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSkuId, setDeleteSkuId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const router = useRouter();

  const handleAddSku = () => {
    router.push("/catalogue/sku-master/create-edit-sku");
  };

  const handleConfirmDelete = () => {
    if (!deleteSkuId) return;
    setDeleteLoading(true);
    setSkus((prev) => prev.filter((s) => s.id !== deleteSkuId));
    setDeleteLoading(false);
    setDeleteOpen(false);
    setDeleteSkuId(null);
  };

  const handleCancelDelete = () => {
    setDeleteOpen(false);
    setDeleteSkuId(null);
  };

  const handleViewSku = (sku: Sku) => {
    router.push(`/catalogue/sku-master/view-sku?id=${sku.id}`);
  };

  const handleEditSku = (sku: Sku) => {
    router.push(`/catalogue/sku-master/create-edit-sku?id=${sku.id}`);
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

      // Update local state after successful API call
      setSkus((prev) =>
        prev.map((s) =>
          s.id === pendingSkuId ? { ...s, isActive: pendingValue } : s
        )
      );
    } catch (error) {
      console.error("Error updating catalogue status:", error);
      // TODO: Show error message to user
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

  // filters
  const filteredSkus = skus.filter((sku) => {
    const q = search.toLowerCase();

    const matchesSearch =
      !q ||
      sku.id.toLowerCase().includes(q) ||
      sku.productName.toLowerCase().includes(q) ||
      sku.brand.toLowerCase().includes(q) ||
      sku.category.toLowerCase().includes(q);

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && sku.isActive) ||
      (statusFilter === "inactive" && !sku.isActive);

    return matchesSearch && matchesStatus;
  });

  const renderCell = {};

  // simple pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredSkus.length / pageSize));
  const pageData = filteredSkus.slice((page - 1) * pageSize, page * pageSize);

  const openDeleteDialog = (skuId: string) => {
    setDeleteSkuId(skuId);
    setDeleteOpen(true);
  };

  const tableData: Record<string, any>[] = pageData.map((sku) => ({
    ...sku,
    status: sku.isActive,
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
          enabled={sku.isActive}
          onChange={(next) => openConfirmForSku(sku.id, next)}
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
            onClick={() => openDeleteDialog(sku.id)}
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
      {/* top controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex gap-4 flex-wrap">
          <Input
            label="Search"
            placeholder="Search Categories"
            labelClassName="text-xl"
            variant="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Search size={16} />}
          />
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
          <div className="min-w-[1200px]">
            <Table
              columns={columns}
              data={tableData}
              renderCell={skuRenderCell}
              minTableWidth="1600px"
            />
          </div>
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
