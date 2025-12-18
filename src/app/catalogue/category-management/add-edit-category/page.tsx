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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const subCategorySchema = z.object({
  name: z.string().min(1, "Sub category name is required"),
  description: z.string().optional(),
  active: z.boolean(),
});

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  active: z.boolean(),
  subCategories: z.array(subCategorySchema).min(1),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type UploadItem = { file: File | null };

const AddEditCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("id");
  const isEdit = Boolean(categoryId);

  const [uploads, setUploads] = useState<UploadItem[]>([{ file: null }]);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      active: false,
      subCategories: [{ name: "", description: "", active: false }],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });

  const handleChangeUpload = (index: number, file: File | null) => {
    setUploads((prev) => {
      const next = [...prev];
      next[index] = { file };
      return next;
    });
  };

  const addUploadField = () => {
    setUploads((prev) => [...prev, { file: null }]);
  };

  const removeUploadField = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const onCancel = () => {
    router.back();
  };

  const onSubmit = (data: CategoryFormValues) => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      router.back();
    }, 2000);
  };

  return (
    <div className="min-h-screen relative">
      <div className="mt-8">
        <BackHeader
          title={isEdit ? `Edit Category - ${categoryId}` : "Add New Category"}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white p-8">
          {/* uploads */}
          <div className="flex flex-wrap gap-12">
            {uploads.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 max-w-lg">
                <FileUpload
                  label={`Upload Category ${index + 1}`}
                  file={item.file}
                  onChange={(file) => handleChangeUpload(index, file)}
                />
                {uploads.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="self-start hover:bg-red-600 hover:text-white rounded-lg"
                    onClick={() => removeUploadField(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex">
            <Button
              type="button"
              className="rounded-lg"
              onClick={addUploadField}
            >
              + Add more
            </Button>
          </div>

          {/* Category main form */}
          <div className="mt-8 flex flex-col gap-4">
            <Input
              label="Category name"
              placeholder="Enter Category name"
              variant="orange"
              {...register("name")}
              error={errors.name?.message}
            />

            <Textarea
              label="Description"
              placeholder="Enter description"
              variant="orange"
              rows={5}
              {...register("description")}
              error={errors.description?.message}
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

          <div className="border my-12" />

          {/* Subcategories */}
          <div className="flex flex-col gap-8">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-xl p-4 flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Sub Category {index + 1}
                  </h3>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="hover:bg-red-600 hover:text-white rounded-lg"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <Input
                  label="Sub Category name"
                  placeholder="Enter Sub Category name"
                  variant="orange"
                  {...register(`subCategories.${index}.name`)}
                  error={errors.subCategories?.[index]?.name?.message}
                />

                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  variant="orange"
                  rows={5}
                  {...register(`subCategories.${index}.description`)}
                  error={errors.subCategories?.[index]?.description?.message}
                />

                <div className="mt-2">
                  <Controller
                    control={control}
                    name={`subCategories.${index}.active`}
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
            ))}

            <Button
              type="button"
              className="rounded-lg self-start"
              onClick={() =>
                append({ name: "", description: "", active: false })
              }
            >
              <Plus size={18} className="mr-2" /> Add Sub Category
            </Button>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <Button className="rounded-lg" type="submit">
              {isEdit ? "Update Category" : "Save Category"}
            </Button>
            <Button
              className="rounded-lg"
              variant="secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>

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
