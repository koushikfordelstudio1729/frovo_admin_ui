"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Select, BackHeader } from "@/components";
import { updateVendor, getVendorById } from "@/services/vendor";
import { toast } from "react-hot-toast";

const categoryOptions = [
  { label: "Packaging", value: "packaging" },
  { label: "Services", value: "services" },
  { label: "Raw Materials", value: "raw_materials" },
  { label: "Equipment", value: "equipment" },
  { label: "Maintenance", value: "maintenance" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const vendorTypeOptions = [
  { label: "Consumables", value: "consumables" },
  { label: "Packaging", value: "packaging" },
  { label: "Logistics", value: "logistics" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Services", value: "services" },
  { label: "Equipment", value: "equipment" },
];

export default function VendorEditPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    vendorName: "",
    category: "",
    riskRating: "",
    vendorType: "",
    contractExpiry: "",
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await getVendorById(vendorId);
        const data = res.data.data;

        setFormData({
          vendorName: data.vendor_name,
          category: data.vendor_category,
          riskRating: data.risk_rating,
          vendorType: Array.isArray(data.vendor_type)
            ? data.vendor_type[0]
            : data.vendor_type,
          contractExpiry: data.contract_expiry_date.split("T")[0],
        });
      } catch (err) {
        toast.error("Failed to fetch vendor details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        vendor_name: formData.vendorName,
        vendor_category: formData.category,
        vendor_type: formData.vendorType,
        risk_rating: formData.riskRating,
        contract_expiry_date: `${formData.contractExpiry}T00:00:00.000Z`,
      };

      await updateVendor(vendorId, payload);
      toast.success("Vendor updated successfully");

      router.push("/vendor/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Vendor update failed");
      console.error(error);
    }
  };

  const handleCancel = () => router.back();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading Vendor Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title={`Edit ${formData.vendorName}`} />

      <div className="bg-white p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-8">
          <Input
            label="Vendor Name"
            variant="orange"
            value={formData.vendorName}
            onChange={(e) => handleInputChange("vendorName", e.target.value)}
          />

          <Select
            label="Category"
            variant="orange"
            value={formData.category}
            selectClassName="py-4 px-4"
            options={categoryOptions}
            onChange={(val) => handleInputChange("category", val)}
          />

          <Select
            label="Risk Rating"
            variant="orange"
            value={formData.riskRating}
            selectClassName="py-4 px-4"
            options={riskRatingOptions}
            onChange={(val) => handleInputChange("riskRating", val)}
          />

          <Input
            label="Contract Expiry"
            type="date"
            variant="orange"
            value={formData.contractExpiry}
            onChange={(e) =>
              handleInputChange("contractExpiry", e.target.value)
            }
          />

          <Select
            label="Vendor Type"
            variant="orange"
            value={formData.vendorType}
            selectClassName="py-4 px-4"
            options={vendorTypeOptions}
            onChange={(val) => handleInputChange("vendorType", val)}
          />
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <Button
            variant="primary"
            size="md"
            className="rounded-lg"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="rounded-lg"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
