"use client";

import { BackHeader, Badge, Button, Select, Textarea } from "@/components";
import { useGRN } from "@/hooks/warehouse";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Edit2 } from "lucide-react";
import type { QCStatus } from "@/types";

const qcStatusOptions = [
  { label: "Excellent", value: "excellent" },
  { label: "Moderate", value: "moderate" },
  { label: "Bad", value: "bad" },
];

const GRNDetail = () => {
  const router = useRouter();
  const params = useParams();
  const grnId = params.id as string;

  const { grn, loading, getGRN, updateGRNStatus, updating, error } = useGRN();

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newQcStatus, setNewQcStatus] = useState<QCStatus>("excellent");
  const [statusRemarks, setStatusRemarks] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (grnId) {
      getGRN(grnId);
    }
  }, [grnId]);

  useEffect(() => {
    if (grn) {
      setNewQcStatus(grn.qc_status);
      setStatusRemarks(grn.remarks);
    }
  }, [grn]);

  const handleUpdateStatus = async () => {
    const result = await updateGRNStatus(grnId, {
      qc_status: newQcStatus,
      remarks: statusRemarks,
    });

    if (result) {
      setSuccessMessage("GRN status updated successfully!");
      setIsEditingStatus(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const statusVariantMap: Record<string, any> = {
    excellent: "approved",
    moderate: "orange",
    bad: "inactive",
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-4">
        <BackHeader title="GRN Details" />
        <div className="mt-6 text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading GRN details...</p>
        </div>
      </div>
    );
  }

  if (!grn) {
    return (
      <div className="min-h-screen pt-4">
        <BackHeader title="GRN Details" />
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            <strong>Error:</strong> GRN not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4">
      <BackHeader title="GRN Details" />

      <div className="max-w-full bg-white rounded-2xl p-8 mt-6">
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

        {/* GRN Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Delivery Challan: {grn.delivery_challan}
            </h2>
            <Badge
              variant={statusVariantMap[grn.qc_status] || "info"}
              label={grn.qc_status.charAt(0).toUpperCase() + grn.qc_status.slice(1)}
              size="md"
              showDot={true}
              className="px-3 py-1 text-sm rounded-full"
            />
          </div>
          {!isEditingStatus && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingStatus(true)}
              className="rounded-lg flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Update Status
            </Button>
          )}
        </div>

        {/* Update Status Section */}
        {isEditingStatus && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update QC Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                id="new-qc-status"
                label="QC Status"
                selectClassName="px-4 py-3 border-2 border-orange-300"
                options={qcStatusOptions}
                value={newQcStatus}
                onChange={(val) => setNewQcStatus(val as QCStatus)}
              />
              <Textarea
                label="Remarks"
                variant="orange"
                placeholder="Enter remarks..."
                rows={3}
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditingStatus(false);
                  setNewQcStatus(grn.qc_status);
                  setStatusRemarks(grn.remarks);
                }}
                disabled={updating}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateStatus}
                disabled={updating}
                isLoading={updating}
                className="rounded-lg"
              >
                {updating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        )}

        {/* GRN Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GRN Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Delivery Challan</p>
              <p className="font-medium text-gray-900">{grn.delivery_challan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Transporter Name</p>
              <p className="font-medium text-gray-900">{grn.transporter_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vehicle Number</p>
              <p className="font-medium text-gray-900">{grn.vehicle_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Received Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(grn.recieved_date), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created By</p>
              <p className="font-medium text-gray-900">{grn.createdBy?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-medium text-gray-900">
                {format(new Date(grn.createdAt), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
          </div>
          {grn.scanned_challan && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Scanned Challan</p>
              <a
                href={grn.scanned_challan}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 underline"
              >
                View Document
              </a>
            </div>
          )}
          {grn.remarks && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Remarks</p>
              <p className="font-medium text-gray-900">{grn.remarks}</p>
            </div>
          )}
        </div>

        {/* Purchase Order Information */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Order Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">PO Number</p>
              <p className="font-medium text-gray-900">{grn.purchase_order.po_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PO Status</p>
              <p className="font-medium text-gray-900 capitalize">{grn.purchase_order.po_status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PO Raised Date</p>
              <p className="font-medium text-gray-900">
                {format(new Date(grn.purchase_order.po_raised_date), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Vendor Information */}
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Vendor Name</p>
              <p className="font-medium text-gray-900">{grn.vendor_details.vendor_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Billing Name</p>
              <p className="font-medium text-gray-900">{grn.vendor_details.vendor_billing_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vendor ID</p>
              <p className="font-medium text-gray-900">{grn.vendor_details.vendor_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{grn.vendor_details.vendor_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{grn.vendor_details.vendor_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">GST Number</p>
              <p className="font-medium text-gray-900">{grn.vendor_details.gst_number}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{grn.vendor_details.vendor_address}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Line Items ({grn.grn_line_items.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Line No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordered Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accepted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grn.grn_line_items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.line_no}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.sku}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity} {item.uom}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 bg-orange-50">
                      <span className="font-medium text-orange-700">
                        {item.received_quantity || item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 bg-green-50">
                      <span className="font-medium text-green-700">
                        {item.accepted_quantity || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 bg-red-50">
                      <span className="font-medium text-red-700">
                        {item.rejected_quantity || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.unit_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      ₹{(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {item.location}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={9} className="px-4 py-3 text-right font-semibold text-gray-900">
                    Grand Total:
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-900 text-lg">
                    ₹
                    {grn.grn_line_items
                      .reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
                      .toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push("/warehouse/grn-summary")}
            className="rounded-lg px-8"
          >
            Back to GRN Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GRNDetail;
