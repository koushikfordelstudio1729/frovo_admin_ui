"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, X, CopyPlus } from "lucide-react";
import {
  Input,
  Select,
  Button,
  Toggle,
  Textarea,
  BackHeader,
  FileUpload,
  SuccessDialog,
} from "@/components";

const CreateSkuPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skuId = searchParams.get("id");
  const isEdit = Boolean(skuId);

  const [isActive, setIsActive] = useState(true);
  const [productImage, setProductImage] = useState<File | null>(null);

  // success dialog state
  const [successOpen, setSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [afterAction, setAfterAction] = useState<"save" | "duplicate">("save");

  const AUTO_CLOSE_MS = 2000;

  const openSuccess = (
    title: string,
    message: string,
    nextAction: "save" | "duplicate"
  ) => {
    setSuccessTitle(title);
    setSuccessMessage(message);
    setAfterAction(nextAction);
    setSuccessOpen(true);

    setTimeout(() => {
      setSuccessOpen(false);
      if (nextAction === "save") {
        router.push("/catalogue/sku-master");
      } else {
      }
    }, AUTO_CLOSE_MS);
  };

  const handleSave = async () => {
    openSuccess(
      isEdit ? "SKU updated successfully" : "SKU created successfully",
      isEdit
        ? "The SKU details have been updated."
        : "A new SKU has been added to the catalogue.",
      "save"
    );
  };

  const handleSaveDuplicate = async () => {
    openSuccess(
      "SKU saved & duplicated",
      "The SKU has been saved. You can now modify the duplicated SKU.",
      "duplicate"
    );
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    router.back();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6">
        <BackHeader title={isEdit ? "Edit SKU" : "Create SKU"} />
        <div className="p-8 bg-white rounded-2xl">
          {/* SKU details */}
          <div className="grid grid-cols-2 gap-8 mb-4">
            <Input label="SKU ID" variant="orange" placeholder="Enter SKU ID" />
            <Input
              label="Product name"
              variant="orange"
              placeholder="Enter product name"
            />
          </div>

          <div className="mb-4">
            <Input
              label="Brand name"
              variant="orange"
              placeholder="Enter brand name"
            />
          </div>

          <div className="mb-6">
            <Textarea
              label="Description"
              variant="orange"
              placeholder="Describe this product"
              rows={4}
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <Select
              label="Category"
              placeholder="Select category"
              variant="orange"
              selectClassName="py-4 px-4"
              options={[]}
              onChange={() => {}}
            />
            <Select
              label="Sub category"
              placeholder="Select sub category"
              variant="orange"
              selectClassName="py-4 px-4"
              options={[]}
              onChange={() => {}}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <Input
              label="Manufacturer Name"
              variant="orange"
              placeholder="Enter manufacturer"
            />
            <Input
              label="Manufacturer Address"
              variant="orange"
              placeholder="Enter address"
            />
          </div>

          <div className="border-2 my-8" />

          {/* Product specifications */}
          <h3 className="text-xl font-semibold text-orange-500 mb-3">
            Product Specifications
          </h3>
          <div className="grid grid-cols-2 gap-8 mb-6">
            <Input
              label="Unit size (Stock)"
              variant="orange"
              placeholder="e.g. 1L / 500g"
            />
            <Input
              label="Storage Type"
              variant="orange"
              placeholder="Ambient / Refrigerated"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <Select
              label="Tags / Label"
              placeholder="Select tag"
              variant="orange"
              selectClassName="py-4 px-4"
              options={[]}
              onChange={() => {}}
            />
            <div />
          </div>

          <div className="border-2 my-8" />

          {/* Pricing */}
          <h3 className="text-xl font-semibold text-orange-500 mb-3">
            Pricing
          </h3>
          <div className="grid grid-cols-2 gap-8 mb-4">
            <Select
              label="Unit Size / UOM"
              placeholder="Select UOM"
              variant="orange"
              selectClassName="py-4 px-4"
              options={[]}
              onChange={() => {}}
            />
            <Input
              label="Base price"
              variant="orange"
              placeholder="Enter base price"
            />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4 mb-8">
            <Input
              label="Discounted / Deal Price"
              variant="orange"
              placeholder="Enter discount price"
            />
          </div>

          <div className="border-2 my-8" />

          {/* Product media */}
          <h3 className="text-xl font-semibold text-orange-500 mb-3">
            Product Media
          </h3>
          <div className="mb-6">
            <FileUpload
              label="Add product image"
              file={productImage}
              onChange={setProductImage}
              accept=".jpg,.jpeg,.png"
            />
          </div>

          <div className="mb-4">
            <Input
              label="Barcode / EAN / UPC"
              variant="orange"
              placeholder="Enter barcode / EAN / UPC"
            />
          </div>

          <div className="mb-4">
            <Textarea
              label="Nutritional information"
              variant="orange"
              rows={3}
              placeholder="Add nutritional information"
            />
          </div>

          <div className="mb-6">
            <Textarea
              label="Ingredients"
              variant="orange"
              rows={3}
              placeholder="List ingredients"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mb-8">
            <Toggle enabled={isActive} onChange={setIsActive} />
            <span className="text-sm text-gray-700">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Footer buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button className="rounded-lg" onClick={handleSave}>
              <Save size={16} className="mr-2" />
              {isEdit ? "Save Changes" : "Save SKU"}
            </Button>

            <Button
              variant="secondary"
              className="rounded-lg bg-black text-white hover:bg-gray-900"
              onClick={handleSaveDuplicate}
            >
              <CopyPlus size={16} className="mr-2" />
              Save & Duplicate
            </Button>

            <Button
              variant="red"
              className="rounded-lg"
              onClick={handleCloseSuccess}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <SuccessDialog
        open={successOpen}
        title={successTitle}
        message={successMessage}
        primaryText={
          afterAction === "save" ? "Go to SKU list" : "Continue editing"
        }
        onClose={handleCloseSuccess}
      />
    </>
  );
};

export default CreateSkuPage;
