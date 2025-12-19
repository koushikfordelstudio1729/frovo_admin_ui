import { useState } from "react";
import type { Category } from "@/components/common/CategoryRow/CategoryRow";

type PendingType = "category" | "subcategory" | null;

export const useCategoryToggleWithConfirm = (initialCategories: Category[]) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

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

    // optional: API calls here based on pendingType + ids

    if (pendingType === "category") {
      applyCategoryToggle(pendingCategoryId, pendingValue);
    } else if (pendingType === "subcategory" && pendingSubName) {
      applySubCategoryToggle(pendingCategoryId, pendingSubName, pendingValue);
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
