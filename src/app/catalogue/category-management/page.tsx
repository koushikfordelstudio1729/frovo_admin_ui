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
import { useState, useEffect, useCallback } from "react";
import { useCategoryToggleWithConfirm } from "@/hooks/catelogue/useCategory";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

interface CategoryStats {
  total_categories: number;
  active_categories: number;
  inactive_categories: number;
}

const CategoryManagement = () => {
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats>({
    total_categories: 0,
    active_categories: 0,
    inactive_categories: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "100",
      });

      if (status) {
        params.append("status", status);
      }

      const response = await api.get<{
        success: boolean;
        data: {
          categories: Array<{
            id: string;
            category_name: string;
            description: string;
            category_status: string;
            category_image: string;
            sub_categories_count: number;
            sub_categories_list: string[];
            createdAt: string;
            updatedAt: string;
          }>;
          stats: CategoryStats;
          totalPages: number;
        };
      }>(`${apiConfig.endpoints.catalogue.categories}?${params}`);

      if (response.data.success) {
        const transformedCategories: Category[] = response.data.data.categories.map((cat) => ({
          id: cat.id,
          name: cat.category_name,
          isActive: cat.category_status === "active",
          subCategories: cat.sub_categories_list.map((subName) => ({
            name: subName,
            createdAt: new Date(cat.createdAt).toLocaleDateString("en-GB"),
            updatedAt: new Date(cat.updatedAt).toLocaleDateString("en-GB"),
            isActive: true,
          })),
        }));

        setCategoriesData(transformedCategories);
        setStats(response.data.data.stats);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
  } = useCategoryToggleWithConfirm(categoriesData);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const totalSubCategories = categoriesData.reduce(
    (sum, cat) => sum + cat.subCategories.length,
    0
  );

  return (
    <div className="min-h-screen pt-12">
      <div className="grid grid-cols-4 gap-8">
        <StatCard
          title="Total Categories"
          count={stats.total_categories}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Total Sub Categories"
          count={totalSubCategories}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Active Categories"
          count={stats.active_categories}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Inactive Categories"
          count={stats.inactive_categories}
          icon={ClipboardCheck}
        />
      </div>

      <div className="mt-12 flex items-end gap-4">
        <div>
          <Input
            label="Search"
            labelClassName="text-xl"
            placeholder="Search Categories"
            variant="search"
            startIcon={<Search size={18} />}
            value={searchQuery}
            onChange={handleSearchChange}
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          categories
            .filter((cat) =>
              cat.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((cat, index) => (
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
            ))
        )}
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
