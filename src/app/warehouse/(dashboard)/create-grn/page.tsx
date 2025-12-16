"use client";

import {
  BackHeader,
  Button,
  Input,
  FileUpload,
  SearchableSelect,
  Select,
  Textarea,
} from "@/components";
import { useGRN, usePurchaseOrders } from "@/hooks/warehouse";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import type { QCStatus, GRNQuantityItem } from "@/types";

const qcStatusOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Moderate", value: "moderate" },
  { label: "Bad", value: "bad" },
];

const CreateGRN = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poIdFromUrl = searchParams.get("poId");

  const { purchaseOrders, loading: loadingPOs } = usePurchaseOrders({
    po_status: "approved",
  });
  const { createGRN, creating, error, clearError } = useGRN();

  const [selectedPOId, setSelectedPOId] = useState(poIdFromUrl || "");
  const [formData, setFormData] = useState({
    delivery_challan: "",
    transporter_name: "",
    vehicle_number: "",
    recieved_date: new Date().toISOString().split("T")[0],
    remarks: "",
    qc_status: "excellent" as QCStatus,
  });

  const [challanDocument, setChallanDocument] = useState<File | null>(null);
  const [damageProofDocument, setDamageProofDocument] = useState<File | null>(
    null
  );
  const [quantities, setQuantities] = useState<Record<string, GRNQuantityItem>>(
    {}
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // Transform POs to options format
  const poOptions = useMemo(() => {
    return purchaseOrders
      .filter((po) => po.po_status === "approved")
      .map((po) => ({
        label: `${po.po_number} - ${po.vendor_details?.vendor_name}`,
        value: po._id,
      }));
  }, [purchaseOrders]);

  // Get selected PO details
  const selectedPO = useMemo(() => {
    return purchaseOrders.find((po) => po._id === selectedPOId);
  }, [purchaseOrders, selectedPOId]);

  // Initialize quantities when PO is selected
  useEffect(() => {
    if (selectedPO) {
      const initialQuantities: Record<string, GRNQuantityItem> = {};
      selectedPO.po_line_items.forEach((item) => {
        initialQuantities[item.sku] = {
          sku: item.sku,
          received_quantity: item.quantity,
          accepted_quantity: item.quantity,
          rejected_quantity: 0,
          expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 12))
            .toISOString()
            .split("T")[0],
          item_remarks: "",
        };
      });
      setQuantities(initialQuantities);
    }
  }, [selectedPO]);

  // Update quantity for a specific item
  const updateQuantity = (
    sku: string,
    field: keyof GRNQuantityItem,
    value: string | number
  ) => {
    setQuantities((prev) => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    setValidationError("");

    if (!selectedPOId) {
      setValidationError("Please select a Purchase Order");
      return false;
    }

    if (!challanDocument) {
      setValidationError("Please upload scanned challan document");
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

    // Validate file size (max 10MB)
    if (challanDocument && challanDocument.size > 10 * 1024 * 1024) {
      setValidationError("Challan file size must be less than 10MB");
      return false;
    }

    if (damageProofDocument && damageProofDocument.size > 10 * 1024 * 1024) {
      setValidationError("Damage proof file size must be less than 10MB");
      return false;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (challanDocument && !allowedTypes.includes(challanDocument.type)) {
      setValidationError(
        "Challan file type not supported. Please upload PDF, JPG, or PNG"
      );
      return false;
    }

    if (
      damageProofDocument &&
      !allowedTypes.includes(damageProofDocument.type)
    ) {
      setValidationError(
        "Damage proof file type not supported. Please upload PDF, JPG, or PNG"
      );
      return false;
    }

    // Validate quantities
    for (const [sku, qty] of Object.entries(quantities)) {
      if (qty.received_quantity < 0) {
        setValidationError(`Invalid received quantity for SKU ${sku}`);
        return false;
      }
      if (qty.accepted_quantity < 0) {
        setValidationError(`Invalid accepted quantity for SKU ${sku}`);
        return false;
      }
      if (qty.rejected_quantity < 0) {
        setValidationError(`Invalid rejected quantity for SKU ${sku}`);
        return false;
      }
      if (
        qty.accepted_quantity + qty.rejected_quantity !==
        qty.received_quantity
      ) {
        setValidationError(
          `For SKU ${sku}: Accepted + Rejected must equal Received quantity`
        );
        return false;
      }
      if (!qty.expiry_date) {
        setValidationError(`Expiry date is required for SKU ${sku}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    clearError();
    setSuccessMessage("");

    if (!validateForm()) return;

    // Create FormData for multipart/form-data request
    const formDataPayload = new FormData();

    // Required fields
    if (challanDocument) {
      formDataPayload.append("document", challanDocument);
    }
    if (damageProofDocument) {
      formDataPayload.append("damageProof", damageProofDocument);
    }
    formDataPayload.append("delivery_challan", formData.delivery_challan);
    formDataPayload.append("transporter_name", formData.transporter_name);
    formDataPayload.append("vehicle_number", formData.vehicle_number);
    formDataPayload.append("qc_status", formData.qc_status);

    // Optional fields
    if (formData.recieved_date) {
      formDataPayload.append(
        "received_date",
        new Date(formData.recieved_date).toISOString()
      );
    }
    if (formData.remarks) {
      formDataPayload.append("remarks", formData.remarks);
    }

    // Quantities
    if (Object.keys(quantities).length > 0) {
      const quantitiesArray = Object.values(quantities).map((qty) => ({
        sku: qty.sku,
        received_quantity: Number(qty.received_quantity),
        accepted_quantity: Number(qty.accepted_quantity),
        rejected_quantity: Number(qty.rejected_quantity),
      }));
      formDataPayload.append("quantities", JSON.stringify(quantitiesArray));
    }

    const result = await createGRN(selectedPOId, formDataPayload);

    if (result) {
      setSuccessMessage(
        `GRN created successfully for ${selectedPO?.po_number}!`
      );
      setTimeout(() => {
        router.push("/warehouse/grn-summary");
      }, 2000);
    }
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Save as draft");
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
          <SearchableSelect
            id="purchase-order"
            label="Purchase Order *"
            placeholder={
              loadingPOs
                ? "Loading purchase orders..."
                : "Search or select Purchase Order"
            }
            variant="orange"
            options={poOptions}
            value={selectedPOId}
            onChange={setSelectedPOId}
            fullWidth
            className={
              loadingPOs || !!poIdFromUrl
                ? "pointer-events-none opacity-70"
                : ""
            }
          />
        </div>
        {/* Selected PO Details */}
        {selectedPO && (
          <div className="mb-8 bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Receive Items Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">PO Number</p>
                <p className="font-medium text-gray-900">
                  {selectedPO.po_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendor</p>
                <p className="font-medium text-gray-900">
                  {selectedPO.vendor_details?.vendor_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PO Date</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(selectedPO.po_raised_date), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="font-medium text-gray-900">
                  {selectedPO.po_line_items.length}
                </p>
              </div>
            </div>

            {/* Line Items with Quantity Inputs */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Line Items & Quantities
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        SKU
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Ordered Qty
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Received *
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Accepted *
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Rejected *
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Expiry Date *
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedPO.po_line_items.map((item) => (
                      <tr key={item._id}>
                        <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                          {item.sku}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          {item.productName}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {item.quantity} {item.uom}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            className="w-20 px-2 py-1 text-sm text-gray-900 bg-white border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={quantities[item.sku]?.received_quantity || 0}
                            onChange={(e) =>
                              updateQuantity(
                                item.sku,
                                "received_quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            className="w-20 px-2 py-1 text-sm text-gray-900 bg-white border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={quantities[item.sku]?.accepted_quantity || 0}
                            onChange={(e) =>
                              updateQuantity(
                                item.sku,
                                "accepted_quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="0"
                            className="w-20 px-2 py-1 text-sm text-gray-900 bg-white border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={quantities[item.sku]?.rejected_quantity || 0}
                            onChange={(e) =>
                              updateQuantity(
                                item.sku,
                                "rejected_quantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="date"
                            className="w-36 px-2 py-1 text-sm text-gray-900 bg-white border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={quantities[item.sku]?.expiry_date || ""}
                            onChange={(e) =>
                              updateQuantity(
                                item.sku,
                                "expiry_date",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            className="w-40 px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                            placeholder="Optional remarks"
                            value={quantities[item.sku]?.item_remarks || ""}
                            onChange={(e) =>
                              updateQuantity(
                                item.sku,
                                "item_remarks",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Note: Accepted + Rejected must equal Received quantity
              </p>
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
            onChange={(e) =>
              setFormData({ ...formData, delivery_challan: e.target.value })
            }
          />
          <Input
            label="Transporter Name *"
            variant="orange"
            placeholder="Enter Transporter Name"
            value={formData.transporter_name}
            onChange={(e) =>
              setFormData({ ...formData, transporter_name: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-12 mb-8">
          <Input
            label="Vehicle Number *"
            variant="orange"
            placeholder="Enter Vehicle Number"
            value={formData.vehicle_number}
            onChange={(e) =>
              setFormData({ ...formData, vehicle_number: e.target.value })
            }
          />
          <Input
            label="Received Date *"
            variant="orange"
            type="date"
            value={formData.recieved_date}
            onChange={(e) =>
              setFormData({ ...formData, recieved_date: e.target.value })
            }
          />
        </div>
        ,<div className="my-6 border-2" />
        {/* Documentation Section */}
        <div className="mb-8 pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Documentation
          </h3>
          <div className="grid grid-cols-2 gap-12 mb-6">
            <FileUpload
              label="Scanned Challan"
              file={challanDocument}
              onChange={setChallanDocument}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <FileUpload
              label="Damage Proof"
              file={damageProofDocument}
              onChange={setDamageProofDocument}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12 mb-6">
          <Select
            id="qc-status"
            label="QC Status"
            selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
            options={qcStatusOptions}
            value={formData.qc_status}
            onChange={(val) =>
              setFormData({ ...formData, qc_status: val as QCStatus })
            }
          />
          <Textarea
            label="Remarks / Notes"
            variant="orange"
            placeholder="Enter any additional notes..."
            rows={4}
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
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
            Submit
          </Button>
          <Button
            className="rounded-lg px-8 bg-gray-600 hover:bg-gray-700"
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleSaveDraft}
            disabled={creating}
          >
            Save Draft
          </Button>
          <Button
            className="rounded-lg px-8 bg-red-600 hover:bg-red-700 text-white"
            type="button"
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
