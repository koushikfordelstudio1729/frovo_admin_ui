"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, Label, Input, Select } from "@/components";
import { vendorData } from "@/config/vendor/vendor-data.config";

const categoryOptions = [
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
  { label: "Food", value: "food" },
];

const statusOptions = [
  { label: "Verified", value: "verified" },
  { label: "Verification", value: "verification" },
  { label: "Pending", value: "pending" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const vendorTypeOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export default function VendorEditPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;

  const [formData, setFormData] = useState({
    vendorName: "",
    category: "",
    status: "",
    riskRating: "",
    onTimePercentage: "",
    contractExpiry: "",
  });

  // Preload vendor data when page loads
  useEffect(() => {
    const found = vendorData.find((vendor) => vendor.id === vendorId);
    if (found) {
      setFormData({
        vendorName: found.vendorName,
        category: found.category,
        status: found.status,
        riskRating: found.riskRating,
        onTimePercentage: found.onTimePercentage,
        contractExpiry: found.contractExpiry,
      });
    }
  }, [vendorId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Updated vendor data:", formData);
    // TODO: API call to update vendor
    router.push("/vendor/dashboard");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-3 mt-2">
          <button onClick={handleCancel} type="button">
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <Label className="text-xl font-semibold">
            {formData.vendorName || "Vendor"} Edit
          </Label>
        </div>
      </div>

      <div className="mx-auto">
        <div className="bg-white p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-8">
            {/* Vendor Name */}
            <div>
              <Input
                label="Vendor Name"
                value={formData.vendorName}
                variant="orange"
                onChange={(e) =>
                  handleInputChange("vendorName", e.target.value)
                }
                placeholder="Enter vendor name"
              />
            </div>

            {/* Category */}
            <div>
              <Select
                label="Category"
                variant="orange"
                value={formData.category}
                onChange={(val) => handleInputChange("category", val)}
                options={categoryOptions}
                placeholder="Select category"
                selectClassName="py-4 p-4"
              />
            </div>

            {/* Status */}
            <div>
              <Select
                label="Status"
                variant="orange"
                value={formData.status}
                onChange={(val) => handleInputChange("status", val)}
                options={statusOptions}
                placeholder="Select status"
                selectClassName="py-4 p-4"
              />
            </div>

            {/* Risk Rating */}
            <div>
              <Select
                label="Risk Rating"
                variant="orange"
                value={formData.riskRating}
                onChange={(val) => handleInputChange("riskRating", val)}
                options={riskRatingOptions}
                placeholder="Select risk rating"
                selectClassName="py-4 p-4"
              />
            </div>

            {/* Contract Expiry */}
            <div>
              <Input
                label="Contract Expiry"
                variant="orange"
                type="date"
                value={formData.contractExpiry}
                onChange={(e) =>
                  handleInputChange("contractExpiry", e.target.value)
                }
                placeholder=""
              />
            </div>
            <div>
              <Select
                label="Vendor Type"
                variant="orange"
                onChange={(val) => handleInputChange("vendorType", val)}
                options={vendorTypeOptions}
                placeholder="Select vendor type"
                selectClassName="py-4 p-4"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-12">
            <Button
              className="rounded-md px-8"
              variant="primary"
              size="md"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
            <Button
              className="rounded-md px-8"
              variant="secondary"
              size="md"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
