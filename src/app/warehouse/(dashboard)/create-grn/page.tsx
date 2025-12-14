"use client";

import {
  BackHeader,
  Button,
  Input,
  Select,
  Textarea,
} from "@/components";
import { useGRN, usePurchaseOrders } from "@/hooks/warehouse";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import type { QCStatus } from "@/types";

const qcStatusOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Moderate", value: "moderate" },
  { label: "Bad", value: "bad" },
];

const CreateGRN = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poIdFromUrl = searchParams.get('poId');

  const { purchaseOrders, loading: loadingPOs } = usePurchaseOrders({ po_status: 'approved' });
  const { createGRN, creating, error, clearError } = useGRN();

  const [selectedPOId, setSelectedPOId] = useState(poIdFromUrl || "");
  const [formData, setFormData] = useState({
    delivery_challan: "",
    transporter_name: "",
    vehicle_number: "",
    recieved_date: new Date().toISOString().split('T')[0],
    remarks: "",
    scanned_challan: "",
    qc_status: "excellent" as QCStatus,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // Transform POs to options format
  const poOptions = useMemo(() => {
    return purchaseOrders
      .filter(po => po.po_status === 'approved')
      .map(po => ({
        label: `${po.po_number} - ${po.vendor_details?.vendor_name}`,
        value: po._id,
      }));
  }, [purchaseOrders]);

  // Get selected PO details
  const selectedPO = useMemo(() => {
    return purchaseOrders.find(po => po._id === selectedPOId);
  }, [purchaseOrders, selectedPOId]);

  const validateForm = () => {
    setValidationError("");

    if (!selectedPOId) {
      setValidationError("Please select a Purchase Order");
      return false;
    }

    if (!formData.delivery_challan) {
      setValidationError("Please enter delivery challan number");
      return false;
    }

    if (!formData.transporter_name) {
      setValidationError("Please enter transporter name");
      return false;
    }

    if (!formData.vehicle_number) {
      setValidationError("Please enter vehicle number");
      return false;
    }

    if (!formData.recieved_date) {
      setValidationError("Please select received date");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    clearError();
    setSuccessMessage("");

    if (!validateForm()) return;

    const payload = {
      delivery_challan: formData.delivery_challan,
      transporter_name: formData.transporter_name,
      vehicle_number: formData.vehicle_number,
      recieved_date: new Date(formData.recieved_date).toISOString(),
      remarks: formData.remarks,
      scanned_challan: formData.scanned_challan,
      qc_status: formData.qc_status,
    };

    const result = await createGRN(selectedPOId, payload);

    if (result) {
      setSuccessMessage(`GRN created successfully for ${selectedPO?.po_number}!`);
      setTimeout(() => {
        router.push("/warehouse/grn-summary");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <BackHeader title="Create New GRN" />

      <div className="max-w-full bg-white rounded-2xl p-8">
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

        {/* Purchase Order Selection */}
        <div className="mb-6">
          <Select
            id="purchase-order"
            label="Purchase Order *"
            placeholder={loadingPOs ? "Loading purchase orders..." : "Select Purchase Order"}
            selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
            options={poOptions}
            value={selectedPOId}
            onChange={setSelectedPOId}
            disabled={loadingPOs || !!poIdFromUrl}
          />
        </div>

        {/* Selected PO Details */}
        {selectedPO && (
          <div className="mb-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Order Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">PO Number</p>
                <p className="font-medium text-gray-900">{selectedPO.po_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendor</p>
                <p className="font-medium text-gray-900">{selectedPO.vendor_details?.vendor_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PO Date</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(selectedPO.po_raised_date), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="font-medium text-gray-900">{selectedPO.po_line_items.length}</p>
              </div>
            </div>

            {/* Line Items Summary */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedPO.po_line_items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2 text-sm text-gray-900 font-medium">{item.sku}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.quantity} {item.uom}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GRN Form Fields */}
        <div className="grid grid-cols-2 gap-12 mb-6">
          <Input
            label="Delivery Challan *"
            variant="orange"
            placeholder="Enter Delivery Challan Number"
            value={formData.delivery_challan}
            onChange={(e) => setFormData({ ...formData, delivery_challan: e.target.value })}
          />
          <Input
            label="Transporter Name *"
            variant="orange"
            placeholder="Enter Transporter Name"
            value={formData.transporter_name}
            onChange={(e) => setFormData({ ...formData, transporter_name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-12 mb-6">
          <Input
            label="Vehicle Number *"
            variant="orange"
            placeholder="Enter Vehicle Number"
            value={formData.vehicle_number}
            onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
          />
          <Input
            label="Received Date *"
            variant="orange"
            type="date"
            value={formData.recieved_date}
            onChange={(e) => setFormData({ ...formData, recieved_date: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-12 mb-6">
          <Input
            label="Scanned Challan URL"
            variant="orange"
            placeholder="Enter scanned challan URL"
            value={formData.scanned_challan}
            onChange={(e) => setFormData({ ...formData, scanned_challan: e.target.value })}
          />
          <Select
            id="qc-status"
            label="QC Status *"
            selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
            options={qcStatusOptions}
            value={formData.qc_status}
            onChange={(val) => setFormData({ ...formData, qc_status: val as QCStatus })}
          />
        </div>

        <div className="mb-8">
          <Textarea
            label="Remarks / Notes"
            variant="orange"
            placeholder="Enter any additional notes..."
            rows={4}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            className="rounded-lg px-8"
            type="button"
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={creating || !selectedPOId}
            isLoading={creating}
          >
            {creating ? "Creating GRN..." : "Submit"}
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

export default CreateGRN;
