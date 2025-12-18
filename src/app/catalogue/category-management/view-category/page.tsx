"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BackHeader, Label, Button, Badge } from "@/components";

type SubCategory = {
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

type Category = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  subCategories: SubCategory[];
};

export default function ViewCategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // MOCK DATA
  const categoryId = searchParams.get("id") ?? "";
  const categoryName = searchParams.get("name") ?? "";
  const categoryDescription = searchParams.get("description") ?? "";
  const categoryActive = (searchParams.get("active") ?? "true") === "true";

  const categoryData: Category = {
    id: categoryId || "CAT-001",
    name: categoryName || "Beverages",
    description:
      categoryDescription ||
      "All types of beverages including soft drinks, juices, and more.",
    active: categoryActive,
    subCategories: [
      {
        name: "Soft Drinks",
        description: "Carbonated beverages",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        active: true,
      },
      {
        name: "Juices",
        description: "Fresh fruit and vegetable juices",
        createdAt: "24-11-2025",
        updatedAt: "24-11-2025",
        active: true,
      },
      {
        name: "Energy Drinks",
        description: "Energy boosting beverages",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        active: false,
      },
      {
        name: "Bottled Water",
        description: "Purified drinking water",
        createdAt: "24-11-2025",
        updatedAt: "18-11-2025",
        active: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <BackHeader title={`View Category - ${categoryData.name}`} />

      <div className="max-w-full mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-sm p-10 space-y-8">
          {/* Header Section */}
          <div className="border-b pb-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryData.name}
            </h1>
            <div className="flex items-center gap-6 text-lg">
              <Badge
                label={categoryData.active ? "Active" : "Inactive"}
                variant={categoryData.active ? "active" : "inactive"}
                size="md"
              />
              <span className="text-gray-500">ID: {categoryData.id}</span>
            </div>
          </div>

          {/* Category Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {categoryData.description}
                </p>
              </div>
            </div>

            {/* Uploads/Files Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Category Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl text-center border-2 border-dashed border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Image 1</p>
                  <p className="text-xs text-blue-600 mt-1">
                    category-beverages-1.jpg
                  </p>
                </div>
                <div className="p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl text-center border-2 border-dashed border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">Image 2</p>
                  <p className="text-xs text-blue-600 mt-1">
                    category-beverages-2.jpg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subcategories Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Sub Categories ({categoryData.subCategories.length})
            </h3>
            <div className="space-y-4">
              {categoryData.subCategories.map((sub, index) => (
                <div
                  key={sub.name}
                  className="border rounded-xl p-6 bg-linear-to-r from-gray-50 to-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {sub.name}
                      </h4>
                      {sub.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {sub.description}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                          <Label className="text-gray-500 font-medium block mb-1">
                            Created
                          </Label>
                          <p className="font-semibold text-gray-900">
                            {sub.createdAt}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-500 font-medium block mb-1">
                            Updated
                          </Label>
                          <p className="font-semibold text-gray-900">
                            {sub.updatedAt}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <Badge
                        label={sub.active ? "Active" : "Inactive"}
                        variant={sub.active ? "active" : "inactive"}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8 border-t flex justify-center">
            <Button
              className="px-12 py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-900 rounded-xl shadow-lg"
              variant="secondary"
              onClick={() => router.push("/catalogue/category-management")}
            >
              <ArrowLeft size={20} className="mr-3" />
              Back to Categories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
