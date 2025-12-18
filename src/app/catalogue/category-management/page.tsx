"use client";

import {
  Input,
  Select,
  StatCard,
  ConfirmDialog,
  Label,
  Button,
} from "@/components";
import CategoryRow, {
  Category,
} from "@/components/common/CategoryRow/CategoryRow";
import { ClipboardCheck, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useCategoryToggleWithConfirm } from "@/hooks/catelogue/useCategory";
import { useRouter } from "next/navigation";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const initialCategories: Category[] = [
  {
    id: "beverages",
    name: "Beverages",
    isActive: true,
    subCategories: [
      {
        name: "Soft Drinks",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
      {
        name: "Juices",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
      {
        name: "Energy Drinks",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
      {
        name: "Bottled Water",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
    ],
  },
  {
    id: "food",
    name: "Food",
    isActive: true,
    subCategories: [
      {
        name: "Chips & Namkeen",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
      {
        name: "Biscuits & Cookies",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
      {
        name: "Chocolates & Candy",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
      {
        name: "Healthy Snacks",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
      {
        name: "Instant Foods",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        isActive: true,
      },
    ],
  },
];

const CategoryManagement = () => {
  const [status, setStatus] = useState("");

  const router = useRouter();

  const handleAddCategory = () => {
    router.push("/catalogue/category-management/add-edit-category");
  };
  const handleEditCategory = (category: Category) => {
    router.push(
      `/catalogue/category-management/add-edit-category?id=${category.id}`
    );
  };

  const handleViewCategory = (category: Category) => {
    router.push(
      `/catalogue/category-management/view-category?id=${category.id}`
    );
  };

  const handleViewSubCategory = (
    categoryId: string,
    subCategoryName: string
  ) => {
    router.push(
      `/catalogue/category-management/view-category?catId=${categoryId}&subName=${encodeURIComponent(
        subCategoryName
      )}`
    );
  };

  const {
    categories,
    confirmOpen,
    confirmLoading,
    pendingValue,
    dialogLabel,
    handleConfirm,
    handleCancel,
    openConfirmForCategory,
    openConfirmForSubCategory,
  } = useCategoryToggleWithConfirm(initialCategories);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  return (
    <div className="min-h-screen pt-12">
      <div className="grid grid-cols-4 gap-8">
        <StatCard title="Total Categories" count={40} icon={ClipboardCheck} />
        <StatCard
          title="Total Sub Categories"
          count={80}
          icon={ClipboardCheck}
        />
        <StatCard title="Active Categories" count={35} icon={ClipboardCheck} />
        <StatCard title="Inactive Categories" count={5} icon={ClipboardCheck} />
      </div>

      <div className="mt-12 flex items-end gap-4">
        <div>
          <Input
            label="Search"
            labelClassName="text-xl"
            placeholder="Search Categories"
            variant="search"
            startIcon={<Search size={18} />}
          />
        </div>
        <div>
          <Select
            label="Status"
            selectClassName="py-2 px-4"
            value={status}
            options={statusOptions}
            onChange={handleStatusChange}
          />
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div>
          <Label className="text-xl font-semibold">Product Category</Label>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-lg" onClick={handleAddCategory}>
            {<Plus size={18} className="mr-2" />} Add Category
          </Button>

          <Button variant="secondary" className="rounded-lg">
            Export Categories
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {categories.map((cat, index) => (
          <CategoryRow
            key={cat.id}
            category={cat}
            enabled={cat.isActive}
            showHeader={index === 0}
            headerLabel="Category name"
            onToggleCategory={(next) => openConfirmForCategory(cat.id, next)}
            onToggleSubCategory={(subName, next) =>
              openConfirmForSubCategory(cat.id, subName, next)
            }
            onEdit={handleEditCategory}
            onView={handleViewCategory}
            onViewSub={handleViewSubCategory}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={`Change ${dialogLabel} status?`}
        message={
          pendingValue === null
            ? ""
            : `Are you sure you want to mark this ${dialogLabel} as ${
                pendingValue ? "Active" : "Inactive"
              }?`
        }
        confirmText="Yes, change"
        cancelText="No"
        confirmVariant={pendingValue === false ? "danger" : "primary"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={confirmLoading}
      />
    </div>
  );
};

export default CategoryManagement;
