import { useState, useEffect } from "react";
import type { Category } from "@/components/common/CategoryRow/CategoryRow";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

type PendingType = "category" | "subcategory" | null;

export const useCategoryToggleWithConfirm = (initialCategories: Category[]) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Update categories when initialCategories changes (from API)
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pendingType, setPendingType] = useState<PendingType>(null);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(
    null
  );
  const [pendingSubName, setPendingSubName] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const applyCategoryToggle = (categoryId: string, next: boolean) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id !== categoryId
          ? cat
          : {
              ...cat,
              isActive: next,
              subCategories: next
                ? cat.subCategories
                : cat.subCategories.map((s) => ({ ...s, isActive: false })),
            }
      )
    );
  };

  const applySubCategoryToggle = (
    categoryId: string,
    subName: string,
    next: boolean
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id !== categoryId
          ? cat
          : {
              ...cat,
              subCategories: cat.subCategories.map((s) =>
                s.name === subName ? { ...s, isActive: next } : s
              ),
            }
      )
    );
  };

  // open confirm
  const openConfirmForCategory = (categoryId: string, next: boolean) => {
    setPendingType("category");
    setPendingCategoryId(categoryId);
    setPendingSubName(null);
    setPendingValue(next);
    setConfirmOpen(true);
  };

  const openConfirmForSubCategory = (
    categoryId: string,
    subName: string,
    next: boolean
  ) => {
    setPendingType("subcategory");
    setPendingCategoryId(categoryId);
    setPendingSubName(subName);
    setPendingValue(next);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingCategoryId || pendingValue === null || !pendingType) return;
    setConfirmLoading(true);

    try {
      if (pendingType === "category") {
        // Call API to update category status
        await api.patch(
          apiConfig.endpoints.catalogue.updateCategoryStatus(pendingCategoryId),
          {
            status: pendingValue ? "active" : "inactive",
          }
        );

        // Update local state after successful API call
        applyCategoryToggle(pendingCategoryId, pendingValue);
      } else if (pendingType === "subcategory" && pendingSubName) {
        // For subcategories, just update local state (no API endpoint for subcategory status)
        applySubCategoryToggle(pendingCategoryId, pendingSubName, pendingValue);
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      // TODO: Show error message to user
    }

    setConfirmLoading(false);
    setConfirmOpen(false);
    setPendingCategoryId(null);
    setPendingSubName(null);
    setPendingValue(null);
    setPendingType(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingCategoryId(null);
    setPendingSubName(null);
    setPendingValue(null);
    setPendingType(null);
  };

  const dialogLabel =
    pendingType === "category"
      ? "category"
      : pendingType === "subcategory"
      ? "sub category"
      : "item";

  return {
    categories,
    confirmOpen,
    confirmLoading,
    pendingValue,
    dialogLabel,
    handleConfirm,
    handleCancel,
    openConfirmForCategory,
    openConfirmForSubCategory,
  };
};
