"use client";

import {
  BackHeader,
  Button,
  FileUpload,
  Input,
  SuccessDialog,
  Textarea,
  Toggle,
} from "@/components";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  subCategories: z.string().optional(),
  subCategoryDescription: z.string().optional(),
  active: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddEditCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("id");
  const isEdit = Boolean(categoryId);

  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      subCategories: "",
      subCategoryDescription: "",
      active: false,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  // Fetch category data when editing
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      try {
        setIsFetching(true);
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
          };
        }>(apiConfig.endpoints.catalogue.categoryById(categoryId));

        if (response.data.success) {
          const data = response.data.data;

          // Populate form with fetched data
          reset({
            name: data.category_name,
            description: data.description,
            subCategories: data.sub_details.sub_categories,
            subCategoryDescription: data.sub_details.description_sub_category,
            active: data.category_status === "active",
          });

          // Set existing image URL if available
          if (data.category_image && data.category_image.length > 0) {
            setExistingImageUrl(data.category_image[0].file_url);
          }
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [categoryId, reset]);

  const onCancel = () => {
    router.back();
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();

      // Add category_name
      formData.append("category_name", data.name);

      // Add description
      if (data.description) {
        formData.append("description", data.description);
      }

      // Create sub_details JSON string
      const subDetails = {
        sub_categories: data.subCategories || "",
        description_sub_category: data.subCategoryDescription || ""
      };

      formData.append("sub_details", JSON.stringify(subDetails));

      // Add category_status
      formData.append("category_status", data.active ? "active" : "inactive");

      // Add file upload (only if a new file is selected)
      if (categoryImage) {
        formData.append("documents", categoryImage);
      }

      // Make API call - POST for create, PUT for update
      let response;
      if (isEdit && categoryId) {
        // Update existing category
        response = await api.put(
          apiConfig.endpoints.catalogue.categoryById(categoryId),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create new category
        response = await api.post(
          apiConfig.endpoints.catalogue.category,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.back();
        }, 2000);
      }
    } catch (err: any) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} category:`, err);
      setError(
        err.response?.data?.message ||
        `Failed to ${isEdit ? 'update' : 'create'} category. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="mt-8">
        <BackHeader
          title={isEdit ? `Edit Category - ${categoryId}` : "Add New Category"}
        />
      </div>

      {isFetching ? (
        <div className="bg-white p-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading category data...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-8">
            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {/* Category Image Upload */}
            <div className="max-w-lg">
              <FileUpload
                label="Upload Category Image"
                file={categoryImage}
                onChange={(file) => setCategoryImage(file)}
              />
              {existingImageUrl && !categoryImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={existingImageUrl}
                    alt="Category"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

          {/* Category Form */}
          <div className="mt-8 flex flex-col gap-4">
            <Input
              label="Category Name"
              placeholder="Enter Category name (e.g., Beverages)"
              variant="orange"
              {...register("name")}
              error={errors.name?.message}
            />

            <Textarea
              label="Description"
              placeholder="Enter description (e.g., All types of beverages including hot and cold drinks)"
              variant="orange"
              rows={5}
              {...register("description")}
              error={errors.description?.message}
            />

            <Input
              label="Sub Categories"
              placeholder="Enter comma-separated subcategories (e.g., Coffee, Tea, Juice, Soda, Water)"
              variant="orange"
              {...register("subCategories")}
              error={errors.subCategories?.message}
            />

            <Textarea
              label="Sub Category Description"
              placeholder="Enter subcategory description (e.g., Various beverage options for customers)"
              variant="orange"
              rows={3}
              {...register("subCategoryDescription")}
              error={errors.subCategoryDescription?.message}
            />

            <div className="mt-4">
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Toggle
                    label="Active / Inactive"
                    enabled={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <Button className="rounded-lg" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Update Category" : "Save Category"}
            </Button>
            <Button
              className="rounded-lg"
              variant="secondary"
              type="button"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
      )}

      <SuccessDialog
        open={showSuccess}
        title={isEdit ? "Category updated" : "Category saved"}
        message={
          isEdit
            ? "Category and sub categories were updated successfully."
            : "Category and sub categories were saved successfully."
        }
        onClose={() => {
          setShowSuccess(false);
          router.back();
        }}
      />
    </div>
  );
};

export default AddEditCategory;
