"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BackHeader, Label, Button, Badge } from "@/components";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

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
  imageUrl?: string;
};

export default function ViewCategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("id") ?? "";

  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setError("No category ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get<{
          success: boolean;
          data: {
            id: string;
            category_name: string;
            description: string;
            sub_details: {
              sub_categories: string;
              sub_categories_list: string[];
              description_sub_category: string;
            };
            category_image: Array<{
              file_url: string;
            }>;
            category_status: string;
            createdAt: string;
            updatedAt: string;
          };
        }>(apiConfig.endpoints.catalogue.categoryById(categoryId));

        if (response.data.success) {
          const data = response.data.data;

          // Transform API response to Category type
          const transformedCategory: Category = {
            id: data.id,
            name: data.category_name,
            description: data.description,
            active: data.category_status === "active",
            imageUrl: data.category_image?.[0]?.file_url || "",
            subCategories: data.sub_details.sub_categories_list.map((subName) => ({
              name: subName,
              description: data.sub_details.description_sub_category,
              createdAt: new Date(data.createdAt).toLocaleDateString("en-GB"),
              updatedAt: new Date(data.updatedAt).toLocaleDateString("en-GB"),
              active: true,
            })),
          };

          setCategoryData(transformedCategory);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-full mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm p-10">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading category data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-full mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm p-10">
            <div className="text-center py-12">
              <p className="text-red-600">{error || "Category not found"}</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/catalogue/category-management")}
              >
                Back to Categories
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Category Image
              </h3>
              {categoryData.imageUrl ? (
                <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={categoryData.imageUrl}
                    alt={categoryData.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-xl text-center border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-500">No image uploaded</p>
                </div>
              )}
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
