"use client";

import { useState, useEffect } from "react";
import {
  BackHeader,
  Button,
  Label,
  Select,
  Textarea,
  Table,
  Badge,
} from "@/components";
import { useRouter } from "next/navigation";
import { getVendors, bulkVerifyVendors } from "@/services/vendor";
import { toast } from "react-hot-toast";
import { Vendor } from "@/types/vendor-data.types";
import { CheckCircle, XCircle } from "lucide-react";

export default function BulkVerifyVendorsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<
    "verified" | "rejected"
  >("verified");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const res = await getVendors({
        page: 1,
        limit: 100,
        verification_status: "pending",
      });
      setVendors(res.data.data.vendors);
    } catch (error) {
      toast.error("Failed to load vendors");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVendorIds([]);
    } else {
      setSelectedVendorIds(vendors.map((v) => v._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectVendor = (vendorId: string) => {
    if (selectedVendorIds.includes(vendorId)) {
      setSelectedVendorIds(selectedVendorIds.filter((id) => id !== vendorId));
    } else {
      setSelectedVendorIds([...selectedVendorIds, vendorId]);
    }
  };

  const handleBulkVerify = async () => {
    if (selectedVendorIds.length === 0) {
      return toast.error("Please select at least one vendor");
    }

    if (verificationStatus === "rejected" && !rejectionReason.trim()) {
      return toast.error("Please provide a rejection reason");
    }

    try {
      setSubmitting(true);
      await bulkVerifyVendors({
        vendor_ids: selectedVendorIds,
        verification_status: verificationStatus,
        rejection_reason:
          verificationStatus === "rejected" ? rejectionReason : undefined,
      });

      toast.success(
        `Successfully ${verificationStatus} ${selectedVendorIds.length} vendor(s)`
      );
      router.push("/vendor/vendor-onboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update vendors");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading Brands...</p>
      </div>
    );
  }

  const columns = [
    { key: "select", label: "" },
    { key: "vendor_id", label: "Brand ID" },
    { key: "vendor_name", label: "Brand Name" },
    { key: "vendor_category", label: "Category" },
    { key: "contact_phone", label: "Contact" },
    { key: "vendor_email", label: "Email" },
    { key: "risk_rating", label: "Risk Rating" },
  ];

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    const vendor = row as Vendor;

    switch (key) {
      case "select":
        return (
          <input
            type="checkbox"
            checked={selectedVendorIds.includes(vendor._id)}
            onChange={() => handleSelectVendor(vendor._id)}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
        );

      case "vendor_category":
        const categoryLabel =
          value === "raw_materials"
            ? "Raw Materials"
            : value.charAt(0).toUpperCase() + value.slice(1);
        return <span className="text-sm">{categoryLabel}</span>;

      case "risk_rating":
        const riskVariant =
          value === "low"
            ? "active"
            : value === "medium"
            ? "warning"
            : "rejected";
        return <Badge label={value.toUpperCase()} variant={riskVariant} />;

      default:
        return value;
    }
  };

  const verificationOptions = [
    { label: "Verify", value: "verified" },
    { label: "Reject", value: "rejected" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title="Bulk Verify Brands" />

      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Label className="text-xl font-semibold text-blue-700 mb-2">
            Bulk Brands Verification
          </Label>
          <p className="text-gray-700">
            Select brands from the list below and choose to verify or reject
            them in bulk. All selected brands will be updated with the same
            verification status.
          </p>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-xl font-semibold">
              Pending brands ({vendors.length})
            </Label>
            <p className="text-gray-500 text-sm mt-1">
              {selectedVendorIds.length} brands(s) selected
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All
            </span>
          </div>
        </div>

        {/* Vendor Table */}
        {vendors.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              No pending brands found for verification
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table columns={columns} data={vendors} renderCell={renderCell} />
          </div>
        )}

        {/* Verification Options */}
        {vendors.length > 0 && (
          <>
            <hr className="border-gray-200" />

            <div className="space-y-6">
              <Label className="text-xl font-semibold">
                Verification Decision
              </Label>

              <div className="grid grid-cols-2 gap-6">
                <Select
                  label="Action *"
                  options={verificationOptions}
                  value={verificationStatus}
                  onChange={(val) => setVerificationStatus(val as any)}
                  selectClassName="py-3 px-4"
                />

                <div className="flex items-center gap-4 pt-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={24} />
                    <span className="text-sm font-medium text-gray-700">
                      Verify: Approve brand for operations
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="text-red-600" size={24} />
                    <span className="text-sm font-medium text-gray-700">
                      Reject: Deny brand access
                    </span>
                  </div>
                </div>
              </div>

              {verificationStatus === "rejected" && (
                <Textarea
                  label="Rejection Reason *"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting these vendors..."
                  rows={4}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="primary"
                onClick={handleBulkVerify}
                disabled={submitting || selectedVendorIds.length === 0}
                className="px-8 rounded-lg"
              >
                {submitting
                  ? "Processing..."
                  : `${
                      verificationStatus === "verified" ? "Verify" : "Reject"
                    } ${selectedVendorIds.length} Vendor(s)`}
              </Button>

              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="px-8 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
