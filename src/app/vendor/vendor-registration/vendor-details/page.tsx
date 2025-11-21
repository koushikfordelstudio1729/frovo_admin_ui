"use client";

import { Button, Input, Label, Select, Textarea } from "@/components";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const vendorTypeOptions = [
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
  { label: "Packaging", value: "packaging" },
  { label: "Services", value: "services" },
];

const vendorCategoryOptions = [
  { label: "Consumables", value: "consumables" },
  { label: "Packaging", value: "packaging" },
  { label: "Logistics", value: "logistics" },
  { label: "Maintenance", value: "maintenance" },
];

const VendorRegistration = () => {
  const router = useRouter();

  const [vendorName, setVendorName] = useState("");
  const [vendorBillingName, setVendorBillingName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [vendorType, setVendorType] = useState("");
  const [vendorCategory, setVendorCategory] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => router.back()}
          type="button"
          className="cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <Label className="text-2xl font-semibold">Vendor Details</Label>
      </div>
      <div className="max-h-full mt-6 p-6 bg-white rounded-lg">
        <div className="grid grid-cols-2 gap-12">
          {/* Vendor Name */}
          <Input
            label="Vendor Name"
            variant="orange"
            placeholder="Enter vendor name"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
          />
          {/* Vendor Billing Name */}
          <Input
            label="Vendor Billing Name"
            variant="orange"
            placeholder="Enter vendor billing name"
            value={vendorBillingName}
            onChange={(e) => setVendorBillingName(e.target.value)}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-12">
          {/* Vendor ID */}
          <Input
            label="Vendor ID"
            variant="orange"
            placeholder="Enter vendor ID"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
          />
          {/* Vendor Type */}
          <Select
            label="Vendor Type"
            variant="orange"
            options={vendorTypeOptions}
            value={vendorType}
            onChange={setVendorType}
            placeholder="Select vendor type"
            selectClassName="py-4 px-4"
          />
        </div>
        {/* Vendor Category */}
        <div className="mt-6 grid grid-cols-2 gap-12">
          <Select
            label="Vendor Category"
            variant="orange"
            options={vendorCategoryOptions}
            value={vendorCategory}
            onChange={setVendorCategory}
            placeholder="Select vendor category"
            selectClassName="py-4 px-4"
          />
          {/* Primary Contact Name */}
          <Input
            label="Primary Contact Name"
            variant="orange"
            placeholder="Enter primary contact name"
            value={primaryContact}
            onChange={(e) => setPrimaryContact(e.target.value)}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-12">
          {/* Contact Phone */}
          <Input
            label="Contact Phone"
            variant="orange"
            placeholder="Enter contact phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          {/* Email ID of Vendor */}
          <Input
            label="Email ID of Vendor"
            variant="orange"
            placeholder="Enter vendor email ID"
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-12">
          {/* Address (Billing) */}
          <Textarea
            label="Address (Billing)"
            variant="orange"
            placeholder="Enter billing address"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
          />
        </div>
        {/* Next Button */}
        <div className="mt-12 flex justify-center">
          <Button
            className="px-10 rounded-lg"
            onClick={() =>
              router.push("/vendor/vendor-registration/financials-compliance")
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;
