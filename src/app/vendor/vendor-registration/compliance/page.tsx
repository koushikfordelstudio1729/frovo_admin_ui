"use client";

import { Button, Input, Label, Select } from "@/components";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const billingCycleOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Per PO", value: "per_po" },
];

const VendorCompliance = () => {
  const router = useRouter();
  const [gstDetails, setGstDetails] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [tdsRate, setTdsRate] = useState("");
  const [billingCycle, setBillingCycle] = useState("");

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
          {/* GST Details */}
          <Input
            label="GST Details"
            variant="orange"
            placeholder="Enter GST details"
            value={gstDetails}
            onChange={(e) => setGstDetails(e.target.value)}
          />
          {/* PAN Number */}
          <Input
            label="PAN Number "
            variant="orange"
            placeholder="Enter PAN number "
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-12">
          {/* TDS Rate */}
          <Input
            label="TDS Rate %"
            variant="orange"
            placeholder="Enter TDS Rate"
            value={tdsRate}
            onChange={(e) => setTdsRate(e.target.value)}
          />
          {/* Billing Cycle */}
          <Select
            label="Billing Cycle "
            variant="orange"
            options={billingCycleOptions}
            value={billingCycle}
            onChange={(value) => setBillingCycle(value)}
            placeholder="Select Billing Cycle"
            selectClassName="py-4 px-4"
          />
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            className="px-10 rounded-lg"
            onClick={() => router.push("/vendor/vendor-registration/status")}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorCompliance;
