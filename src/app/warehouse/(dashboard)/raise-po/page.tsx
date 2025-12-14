"use client";

import { BackHeader, Button, Input, Select, Textarea } from "@/components";
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

  const handleSubmit = async (status: "draft" | "approved") => {
    clearError();
    setSuccessMessage("");

    if (!validateForm()) return;

    // Convert line items dates to ISO format
    const formattedLineItems = lineItems.map(item => ({
      ...item,
      expected_delivery_date: new Date(item.expected_delivery_date!).toISOString(),
    }));

    const payload = {
      vendor: formData.vendor,
      po_raised_date: new Date(formData.po_raised_date).toISOString(),
      po_status: status,
      remarks: formData.remarks,
      po_line_items: formattedLineItems as Omit<POLineItem, '_id'>[],
    };

    const result = await createPurchaseOrder(payload);

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
