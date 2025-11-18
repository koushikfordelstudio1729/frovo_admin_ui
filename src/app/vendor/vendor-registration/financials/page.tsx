"use client";

import { Button, Input, Label, Select } from "@/components";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const paymentTermsOptions = [
  { label: "Net 7", value: "net7" },
  { label: "Net 15", value: "net15" },
  { label: "Net 30", value: "net30" },
];

const VendorFinancials = () => {
  const router = useRouter();
  const [baVendor, setBaVendor] = useState("");
  const [ifscCode, setifscCode] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center gap-3 mt-2">
        {/* Vendor Registration */}
        <button
          onClick={() => router.back()}
          type="button"
          className="cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <Label className="text-2xl font-semibold">Vendor Registration</Label>
      </div>
      <div className="max-h-full mt-6 p-6 bg-white rounded-lg">
        <div className="grid grid-cols-2 gap-12">
          {/* Bank Account of Vendor*/}
          <Input
            label="Bank Account of Vendor"
            variant="orange"
            placeholder="Enter Bank Account of Vendor"
            value={baVendor}
            onChange={(e) => setBaVendor(e.target.value)}
          />
          {/* Vendor Billing Name*/}
          <Input
            label="Vendor Billing Name"
            variant="orange"
            placeholder="Enter vendor billing name"
            value={ifscCode}
            onChange={(e) => setifscCode(e.target.value)}
          />
        </div>
        <div className="mt-6 w-lg">
          <Select
            label="Payment Terms"
            variant="orange"
            options={paymentTermsOptions}
            value={paymentTerms}
            onChange={(value) => setPaymentTerms(value)}
            selectClassName="py-4 px-4"
          />
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            className="px-10 rounded-lg"
            onClick={() =>
              router.push("/vendor/vendor-registration/compliance")
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorFinancials;
