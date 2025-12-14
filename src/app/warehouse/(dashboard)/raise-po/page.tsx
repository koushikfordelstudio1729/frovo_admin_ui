"use client";

import { BackHeader, Button, Input, Select, Textarea, MultipleFileUpload } from "@/components";
import { usePurchaseOrder, useVendors } from "@/hooks/warehouse";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { POLineItem } from "@/types";

const categoryOptions = [
  { label: "Snacks", value: "Snacks" },
  { label: "Beverages", value: "Beverages" },
  { label: "Dairy", value: "Dairy" },
  { label: "Frozen", value: "Frozen" },
];

const uomOptions = [
  { label: "Pack", value: "Pack" },
  { label: "Box", value: "Box" },
  { label: "Carton", value: "Carton" },
  { label: "Bottle", value: "Bottle" },
  { label: "Can", value: "Can" },
];

const RaisePO = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const {
    purchaseOrder,
    createPurchaseOrder,
    getPurchaseOrder,
    creating,
    loading,
    error,
    clearError
  } = usePurchaseOrder();

  const { vendors, loading: vendorsLoading } = useVendors();

  const [formData, setFormData] = useState({
    vendor: "",
    po_status: "draft" as const,
    po_raised_date: new Date().toISOString().split('T')[0],
    remarks: "",
  });

  const [lineItems, setLineItems] = useState<Partial<POLineItem>[]>([
    {
      line_no: 1,
      sku: "",
      productName: "",
      quantity: 0,
      category: "",
      pack_size: "",
      uom: "",
      unit_price: 0,
      expected_delivery_date: "",
      location: "",
    },
  ]);

  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [lineItemImages, setLineItemImages] = useState<{ [key: number]: File[] }>({});
  const [existingLineItemImages, setExistingLineItemImages] = useState<{ [key: number]: any[] }>({});

  // Debug: Monitor lineItemImages state changes
  useEffect(() => {
    console.log('lineItemImages state changed:', lineItemImages);
  }, [lineItemImages]);

  // Transform vendors to options format
  const vendorOptions = useMemo(() => {
    return vendors.map(vendor => ({
      label: vendor.vendor_name,
      value: vendor._id,
    }));
  }, [vendors]);

  // Fetch PO data when in edit mode
  useEffect(() => {
    if (editId) {
      setIsEditMode(true);
      getPurchaseOrder(editId);
    }
  }, [editId]);

  // Pre-fill form when PO data is loaded
  useEffect(() => {
    if (purchaseOrder && isEditMode) {
      setFormData({
        vendor: purchaseOrder.vendor?._id || "",
        po_status: purchaseOrder.po_status,
        po_raised_date: purchaseOrder.po_raised_date.split('T')[0],
        remarks: purchaseOrder.remarks || "",
      });

      setLineItems(purchaseOrder.po_line_items.map(item => ({
        line_no: item.line_no,
        sku: item.sku,
        productName: item.productName,
        quantity: item.quantity,
        category: item.category,
        pack_size: item.pack_size,
        uom: item.uom,
        unit_price: item.unit_price,
        expected_delivery_date: item.expected_delivery_date.split('T')[0],
        location: item.location,
      })));

      // Load existing images
      const existingImages: { [key: number]: any[] } = {};
      purchaseOrder.po_line_items.forEach((item, index) => {
        if (item.images && item.images.length > 0) {
          existingImages[index] = item.images;
        }
      });
      setExistingLineItemImages(existingImages);
    }
  }, [purchaseOrder, isEditMode]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        line_no: lineItems.length + 1,
        sku: "",
        productName: "",
        quantity: 0,
        category: "",
        pack_size: "",
        uom: "",
        unit_price: 0,
        expected_delivery_date: "",
        location: "",
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      const newItems = lineItems.filter((_, i) => i !== index);
      // Renumber line items
      const renumbered = newItems.map((item, i) => ({
        ...item,
        line_no: i + 1,
      }));
      setLineItems(renumbered);

      // Remove images for deleted line item and reindex
      const newImages: { [key: number]: File[] } = {};
      Object.keys(lineItemImages).forEach(key => {
        const idx = parseInt(key);
        if (idx < index) {
          newImages[idx] = lineItemImages[idx];
        } else if (idx > index) {
          newImages[idx - 1] = lineItemImages[idx];
        }
      });
      setLineItemImages(newImages);
    }
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const newItems = [...lineItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setLineItems(newItems);
  };

  const validateForm = () => {
    setValidationError("");

    if (!formData.vendor) {
      setValidationError("Please select a vendor");
      return false;
    }

    if (!formData.po_raised_date) {
      setValidationError("Please select PO raised date");
      return false;
    }

    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      if (!item.sku || !item.productName || !item.quantity || !item.category ||
          !item.uom || !item.unit_price || !item.expected_delivery_date) {
        setValidationError(`Please fill all required fields for line item ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const validateFiles = (): boolean => {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    for (let index in lineItemImages) {
      const files = lineItemImages[index];
      for (let file of files) {
        if (!allowedTypes.includes(file.type)) {
          setValidationError(`File ${file.name} in line item ${parseInt(index) + 1} has invalid type. Only JPG, PNG, and PDF allowed.`);
          return false;
        }
        if (file.size > maxFileSize) {
          setValidationError(`File ${file.name} in line item ${parseInt(index) + 1} exceeds 5MB size limit.`);
          return false;
        }
      }
    }
    return true;
  };

  const updateLineItemImages = (index: number, files: File[]) => {
    console.log(`updateLineItemImages called for index ${index}:`, files);
    setLineItemImages(prev => {
      const updated = {
        ...prev,
        [index]: files
      };
      console.log('Updated lineItemImages state:', updated);
      return updated;
    });
  };

  const handleSubmit = async (status: "draft" | "approved") => {
    clearError();
    setSuccessMessage("");

    if (!validateForm()) return;
    if (!validateFiles()) return;

    // Convert line items dates to ISO format
    const formattedLineItems = lineItems.map(item => ({
      ...item,
      expected_delivery_date: new Date(item.expected_delivery_date!).toISOString(),
    }));

    let result;

    // Check if there are any images
    const hasImages = Object.keys(lineItemImages).some(key => {
      const files = lineItemImages[parseInt(key)];
      return files && files.length > 0;
    });

    console.log('Line Item Images:', lineItemImages);
    console.log('Has Images:', hasImages);

    // If there are images, use FormData; otherwise use JSON
    if (hasImages) {
      // Build FormData for file upload support
      const formDataPayload = new FormData();
      formDataPayload.append('vendor', formData.vendor);
      formDataPayload.append('po_raised_date', new Date(formData.po_raised_date).toISOString());
      formDataPayload.append('po_status', status);
      formDataPayload.append('remarks', formData.remarks);
      formDataPayload.append('po_line_items', JSON.stringify(formattedLineItems));

      // Append images for each line item
      Object.keys(lineItemImages).forEach(indexStr => {
        const index = parseInt(indexStr);
        const files = lineItemImages[index];
        console.log(`Appending files for line item ${index}:`, files);

        if (files && files.length > 0) {
          files.forEach(file => {
            console.log(`Appending file:`, file.name, file.type, file.size);
            formDataPayload.append(`images_${index}`, file);
          });
        }
      });

      // Debug: Log FormData contents
      console.log('FormData entries:');
      for (let [key, value] of formDataPayload.entries()) {
        console.log(key, value);
      }

      result = await createPurchaseOrder(formDataPayload);
    } else {
      // Use original JSON format when no images
      const payload = {
        vendor: formData.vendor,
        po_raised_date: new Date(formData.po_raised_date).toISOString(),
        po_status: status,
        remarks: formData.remarks,
        po_line_items: formattedLineItems as Omit<POLineItem, '_id'>[],
      };

      result = await createPurchaseOrder(payload);
    }

    if (result) {
      setSuccessMessage(`Purchase Order ${result.po_number} created successfully!`);
      setTimeout(() => {
        router.push("/warehouse/po-summery");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <BackHeader title={isEditMode ? "Edit Purchase Order" : "Raise Purchase Order"} />

      <div className="max-w-full bg-white rounded-2xl p-8">
        {/* Loading State for Edit Mode */}
        {loading && isEditMode && (
          <div className="mb-6 text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading purchase order data...</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700">
              <strong>Validation Error:</strong> {validationError}
            </p>
          </div>
        )}

        {/* Edit Mode Info */}
        {isEditMode && !loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700">
              <strong>Note:</strong> You are editing PO {purchaseOrder?.po_number}. Submitting will create a new purchase order based on this data.
            </p>
          </div>
        )}

        {/* PO Header Information */}
        <div className="grid grid-cols-2 gap-12 mb-6">
          <div>
            <Select
              id="vendor"
              label="Vendor *"
              placeholder={vendorsLoading ? "Loading vendors..." : "Select Vendor"}
              selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
              options={vendorOptions}
              value={formData.vendor}
              onChange={(val) => setFormData({ ...formData, vendor: val })}
              disabled={vendorsLoading}
            />
          </div>
          <div>
            <Input
              label="PO Raise Date *"
              variant="orange"
              type="date"
              value={formData.po_raised_date}
              onChange={(e) => setFormData({ ...formData, po_raised_date: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-8">
          <Textarea
            label="Remarks / Notes"
            variant="orange"
            placeholder="Enter any additional notes..."
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>

        {/* Line Items Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Line Items</h3>
            <Button
              onClick={addLineItem}
              variant="secondary"
              size="sm"
              className="rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Line Item
            </Button>
          </div>

          {lineItems.map((item, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-6 mb-4 relative">
              <div className="absolute top-4 right-4">
                {lineItems.length > 1 && (
                  <button
                    onClick={() => removeLineItem(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <h4 className="font-semibold text-gray-700 mb-4">Line Item {item.line_no}</h4>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="SKU *"
                  variant="orange"
                  placeholder="Enter SKU"
                  value={item.sku}
                  onChange={(e) => updateLineItem(index, 'sku', e.target.value)}
                />
                <Input
                  label="Product Name *"
                  variant="orange"
                  placeholder="Enter product name"
                  value={item.productName}
                  onChange={(e) => updateLineItem(index, 'productName', e.target.value)}
                />
                <Input
                  label="Quantity *"
                  variant="orange"
                  type="number"
                  placeholder="Enter quantity"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                />
                <Select
                  id={`category-${index}`}
                  label="Category *"
                  options={categoryOptions}
                  value={item.category}
                  onChange={(val) => updateLineItem(index, 'category', val)}
                  selectClassName="px-4 py-3 border-2 border-orange-300"
                />
                <Input
                  label="Pack Size"
                  variant="orange"
                  placeholder="e.g., 25g"
                  value={item.pack_size}
                  onChange={(e) => updateLineItem(index, 'pack_size', e.target.value)}
                />
                <Select
                  id={`uom-${index}`}
                  label="UOM *"
                  options={uomOptions}
                  value={item.uom}
                  onChange={(val) => updateLineItem(index, 'uom', val)}
                  selectClassName="px-4 py-3 border-2 border-orange-300"
                />
                <Input
                  label="Unit Price *"
                  variant="orange"
                  type="number"
                  step="0.01"
                  placeholder="Enter unit price"
                  value={item.unit_price}
                  onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                />
                <Input
                  label="Expected Delivery *"
                  variant="orange"
                  type="date"
                  value={item.expected_delivery_date}
                  onChange={(e) => updateLineItem(index, 'expected_delivery_date', e.target.value)}
                />
                <Input
                  label="Location"
                  variant="orange"
                  placeholder="e.g., Warehouse A"
                  value={item.location}
                  onChange={(e) => updateLineItem(index, 'location', e.target.value)}
                />
              </div>

              {/* Product Images for this line item */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                  Product Images (Optional)
                </h5>

                {/* Show existing images in edit mode */}
                {isEditMode && existingLineItemImages[index] && existingLineItemImages[index].length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Previously Uploaded Images:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {existingLineItemImages[index].map((image: any) => (
                        <a
                          key={image._id}
                          href={image.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-lg border-2 border-blue-200 hover:border-blue-500 transition-all hover:shadow-lg bg-white"
                        >
                          {image.mime_type?.startsWith('image/') ? (
                            <img
                              src={image.file_url}
                              alt={image.file_name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <div className="text-center">
                                <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs text-gray-500 mt-1">PDF</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-white truncate">{image.file_name}</p>
                            <p className="text-xs text-gray-300">{(image.file_size / 1024).toFixed(1)} KB</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Note: These images are from the original PO. Upload new images below if needed.
                    </p>
                  </div>
                )}

                {/* Upload new images */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {isEditMode ? 'Upload New Images' : 'Upload Images'}
                  </p>
                  <MultipleFileUpload
                    files={lineItemImages[index] || []}
                    onChange={(files) => updateLineItemImages(index, files)}
                    accept=".jpg,.jpeg,.png,.pdf"
                    maxFiles={5}
                    maxSizePerFile={5 * 1024 * 1024}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {isEditMode
                      ? '✨ You can upload multiple new images (up to 5 files, 5MB each)'
                      : 'Upload multiple product images or documents (Max 5 files, 5MB each)'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            className="rounded-lg px-8"
            type="button"
            variant="primary"
            size="lg"
            onClick={() => handleSubmit("approved")}
            disabled={creating}
            isLoading={creating}
          >
            {creating ? "Creating..." : "Submit for Approval"}
          </Button>
          <Button
            className="rounded-lg px-8"
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => handleSubmit("draft")}
            disabled={creating}
          >
            Save as Draft
          </Button>
          <Button
            className="rounded-lg px-8"
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
            disabled={creating}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RaisePO;
