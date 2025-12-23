"use client";

import { useState, useEffect } from "react";
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
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

const CreateSkuPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skuId = searchParams.get("id");
  const isEdit = Boolean(skuId);

  // Form state
  const [skuIdValue, setSkuIdValue] = useState("");
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerAddress, setManufacturerAddress] = useState("");
  const [shellLife, setShellLife] = useState("");
  const [expiryAlertThreshold, setExpiryAlertThreshold] = useState("30");
  const [tagsLabel, setTagsLabel] = useState("");
  const [unitSize, setUnitSize] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [nutritionInfo, setNutritionInfo] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [productImages, setProductImages] = useState<(File | null)[]>([null, null, null]);

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch catalogue data when in edit mode
  useEffect(() => {
    const fetchCatalogueData = async () => {
      if (!skuId) return;

      try {
        setIsFetchingData(true);
        setError(null);

        const response = await api.get(
          apiConfig.endpoints.catalogue.catalogueById(skuId)
        );

        if (response.data.success) {
          const data = response.data.data;

          // Populate form fields
          setSkuIdValue(data.sku_id || "");
          setProductName(data.product_name || "");
          setBrandName(data.brand_name || "");
          setDescription(data.description || "");
          setCategory(data.category || "");
          setSubCategory(data.sub_category || "");
          setManufacturerName(data.manufacturer_name || "");
          setManufacturerAddress(data.manufacturer_address || "");
          setShellLife(data.shell_life || "");
          setExpiryAlertThreshold(data.expiry_alert_threshold?.toString() || "30");
          setTagsLabel(data.tages_label || "");
          setUnitSize(data.unit_size || "");
          setBasePrice(data.base_price?.toString() || "");
          setFinalPrice(data.final_price?.toString() || "");
          setBarcode(data.barcode || "");
          setNutritionInfo(data.nutrition_information || "");
          setIngredients(data.ingredients || "");
          setIsActive(data.status === "active");
        }
      } catch (err: any) {
        console.error("Error fetching catalogue data:", err);
        setError("Failed to load catalogue data. Please try again.");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchCatalogueData();
  }, [skuId]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(apiConfig.endpoints.catalogue.categories);

        if (response.data.success && response.data.data.categories) {
          setCategories(response.data.data.categories);
        }
      } catch (err: any) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Update sub-categories when category changes
  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find(
        (cat) => cat.category_name === category
      );

      if (selectedCategory && selectedCategory.sub_categories_list) {
        setSubCategories(selectedCategory.sub_categories_list);
      } else {
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
      setSubCategory("");
    }
  }, [category, categories]);

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
    try {
      setIsLoading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();

      formData.append("sku_id", skuIdValue);
      formData.append("product_name", productName);
      formData.append("brand_name", brandName);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("sub_category", subCategory);
      formData.append("manufacturer_name", manufacturerName);
      formData.append("manufacturer_address", manufacturerAddress);
      formData.append("shell_life", shellLife);
      formData.append("expiry_alert_threshold", expiryAlertThreshold);
      formData.append("tages_label", tagsLabel);
      formData.append("unit_size", unitSize);
      formData.append("base_price", basePrice);
      formData.append("final_price", finalPrice);
      formData.append("barcode", barcode);
      formData.append("nutrition_information", nutritionInfo);
      formData.append("ingredients", ingredients);
      formData.append("status", isActive ? "active" : "inactive");

      // Add product images (only if new files are selected)
      productImages.forEach((img) => {
        if (img) {
          formData.append("documents", img);
        }
      });

      // Make API call - POST for create, PUT for update
      let response;
      if (isEdit && skuId) {
        response = await api.put(
          apiConfig.endpoints.catalogue.updateCatalogue(skuId),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await api.post(
          apiConfig.endpoints.catalogue.skuCatalogue,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.success) {
        openSuccess(
          isEdit ? "SKU updated successfully" : "SKU created successfully",
          isEdit
            ? "The SKU details have been updated."
            : "A new SKU has been added to the catalogue.",
          "save"
        );
      }
    } catch (err: any) {
      console.error("Error saving SKU:", err);
      setError(
        err.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} SKU. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
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

  // Show loading while fetching data in edit mode
  if (isFetchingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading catalogue data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6">
        <BackHeader title={isEdit ? "Edit SKU" : "Create SKU"} />
        <div className="p-8 bg-white rounded-2xl">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* SKU details */}
          <div className="grid grid-cols-2 gap-8 mb-4">
            <Input
              label="SKU ID"
              variant="orange"
              placeholder="Enter SKU ID"
              value={skuIdValue}
              onChange={(e) => setSkuIdValue(e.target.value)}
            />
            <Input
              label="Product name"
              variant="orange"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Brand name"
              variant="orange"
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Textarea
              label="Description"
              variant="orange"
              placeholder="Describe this product"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <Select
              label="Category"
              placeholder="Select category"
              variant="orange"
              value={category}
              onChange={(value) => setCategory(value)}
              options={categories.map((cat) => ({
                value: cat.category_name,
                label: cat.category_name,
              }))}
            />
            <Select
              label="Sub category"
              placeholder="Select sub category"
              variant="orange"
              value={subCategory}
              onChange={(value) => setSubCategory(value)}
              disabled={!category || subCategories.length === 0}
              options={subCategories.map((subCat) => ({
                value: subCat,
                label: subCat,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <Input
              label="Manufacturer Name"
              variant="orange"
              placeholder="Enter manufacturer"
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
            />
            <Input
              label="Manufacturer Address"
              variant="orange"
              placeholder="Enter address"
              value={manufacturerAddress}
              onChange={(e) => setManufacturerAddress(e.target.value)}
            />
          </div>

          <div className="border-2 my-8" />

          {/* Product specifications */}
          <h3 className="text-xl font-semibold text-orange-500 mb-3">
            Product Specifications
          </h3>
          <div className="grid grid-cols-2 gap-8 mb-6">
            <Input
              label="Unit size"
              variant="orange"
              placeholder="e.g. 250g, 1L"
              value={unitSize}
              onChange={(e) => setUnitSize(e.target.value)}
            />
            <Input
              label="Shell Life"
              variant="orange"
              placeholder="e.g. 12 months"
              value={shellLife}
              onChange={(e) => setShellLife(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <Input
              label="Expiry Alert Threshold (days)"
              variant="orange"
              placeholder="Enter threshold in days"
              value={expiryAlertThreshold}
              onChange={(e) => setExpiryAlertThreshold(e.target.value)}
            />
            <Input
              label="Tags / Label"
              variant="orange"
              placeholder="e.g. premium, organic, fair-trade"
              value={tagsLabel}
              onChange={(e) => setTagsLabel(e.target.value)}
            />
          </div>

          <div className="border-2 my-8" />

          {/* Pricing */}
          <h3 className="text-xl font-semibold text-orange-500 mb-3">
            Pricing
          </h3>
          <div className="grid grid-cols-2 gap-8 mb-4">
            <Input
              label="Base price"
              variant="orange"
              placeholder="Enter base price"
              type="number"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            <Input
              label="Final / Discounted Price"
              variant="orange"
              placeholder="Enter final price"
              type="number"
              step="0.01"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
            />
          </div>

          <div className="border-2 my-8" />

          {/* Product media */}
          <h3 className="text-xl font-semibold text-orange-500 mb-3">
            Product Media
          </h3>
          <div className="mb-6 space-y-4">
            {productImages.map((img, idx) => (
              <FileUpload
                key={idx}
                label={`Product Image ${idx + 1}${idx > 0 ? " (Optional)" : ""}`}
                file={img}
                onChange={(file) => {
                  const newImages = [...productImages];
                  newImages[idx] = file;
                  setProductImages(newImages);
                }}
                accept=".jpg,.jpeg,.png"
              />
            ))}
          </div>

          <div className="mb-4">
            <Input
              label="Barcode / EAN / UPC"
              variant="orange"
              placeholder="Enter barcode / EAN / UPC"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Textarea
              label="Nutritional information"
              variant="orange"
              rows={3}
              placeholder="Add nutritional information"
              value={nutritionInfo}
              onChange={(e) => setNutritionInfo(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <Textarea
              label="Ingredients"
              variant="orange"
              rows={3}
              placeholder="List ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
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
            <Button
              className="rounded-lg"
              onClick={handleSave}
              isLoading={isLoading}
              disabled={isLoading}
            >
              <Save size={16} className="mr-2" />
              {isEdit ? "Save Changes" : "Save SKU"}
            </Button>

            <Button
              variant="secondary"
              className="rounded-lg bg-black text-white hover:bg-gray-900"
              onClick={handleSaveDuplicate}
              disabled={isLoading}
            >
              <CopyPlus size={16} className="mr-2" />
              Save & Duplicate
            </Button>

            <Button
              variant="red"
              className="rounded-lg"
              onClick={handleCloseSuccess}
              disabled={isLoading}
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
