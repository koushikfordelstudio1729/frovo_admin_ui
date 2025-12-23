"use client";

import { Eye, Edit3, Trash2 } from "lucide-react";
import { Toggle } from "@/components";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type SubCategory = {
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type Category = {
  id: string;
  name: string;
  isActive: boolean;
  subCategories: SubCategory[];
};

type CategoryRowProps = {
  category: Category;
  showHeader?: boolean;
  headerLabel?: string;
  enabled: boolean;
  onToggleCategory: (next: boolean) => void;
  onToggleSubCategory: (subName: string, next: boolean) => void;
  onEdit?: (category: Category) => void;
  onView?: (category: Category) => void;
  onViewSub?: (categoryId: string, subName: string) => void;
  onDelete?: (category: Category) => void;
};

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  showHeader = false,
  headerLabel = "Category name",
  enabled,
  onToggleCategory,
  onToggleSubCategory,
  onEdit,
  onView,
  onViewSub,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {showHeader && (
        <div className="bg-black text-white px-6 py-3 text-lg font-semibold">
          {headerLabel}
        </div>
      )}

      <div className="border-b border-gray-200">
        {/* Top row - Category */}
        <div className="flex bg-white items-center justify-between text-gray-800 py-4 px-4">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer flex-1"
            onClick={() => setOpen((p) => !p)}
          >
            <span className="text-lg font-semibold text-left">
              {category.name}
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div className="flex items-center gap-4">
            <Toggle
              enabled={enabled}
              onChange={onToggleCategory}
              label="Active / Inactive"
            />

            <div className="flex items-center gap-2">
              <button
                className="p-2 text-blue-600 hover:text-blue-800 rounded-lg transition-colors cursor-pointer"
                onClick={() => onView?.(category)}
                title="View Category"
              >
                <Eye size={18} />
              </button>
              <button
                className="px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                onClick={() => onEdit?.(category)}
              >
                Edit
              </button>
              <button
                className="p-2 text-red-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                onClick={() => onDelete?.(category)}
                title="Delete Category"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-categories section */}
        {open && category.subCategories.length > 0 && (
          <div className="bg-gray-100 text-gray-700 px-8 py-4">
            {category.subCategories.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center justify-between py-3 border-t border-gray-100 first:border-t-0"
              >
                <div className="w-1/3 text-sm font-medium">{sub.name}</div>

                <div className="w-1/3 text-sm">
                  <p className="font-semibold">Created at</p>
                  <p>{sub.createdAt}</p>
                </div>

                <div className="w-1/3 text-sm">
                  <p className="font-semibold">Last updated date</p>
                  <p>{sub.updatedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryRow;
