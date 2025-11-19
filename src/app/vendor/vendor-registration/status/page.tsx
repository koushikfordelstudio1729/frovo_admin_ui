"use client";

import { Button, Input, Label, Select, Textarea } from "@/components";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statusCycleOptions = [
  { label: "Procurement", value: "procurement" },
  { label: "Restocking", value: "restocking" },
  { label: "Finance Reconciliation", value: "finance_reconciliation" },
  { label: "Audit", value: "audit" },
];

const verificationStatusOptions = [
  { label: "Pending Verification", value: "pending_verification" },
  { label: "Verified", value: "verified" },
  { label: "Failed", value: "failed" },
  { label: "Rejected", value: "rejected" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const VendorStatus = () => {
  const router = useRouter();

  const [statusCycle, setStatusCycle] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [riskRating, setRiskRating] = useState("");
  const [riskNotes, setRiskNotes] = useState("");
  const [verifiedBy, setVerifiedBy] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with back */}
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <Label className="text-2xl font-semibold">Vendor Registration</Label>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg">
        <div className="grid grid-cols-2 gap-12">
          {/* Vendor Status Cycle */}
          <Select
            label="Vendor Status Cycle"
            variant="orange"
            options={statusCycleOptions}
            value={statusCycle}
            onChange={setStatusCycle}
            placeholder="Select vendor status cycle"
            selectClassName="py-4 px-4"
          />
          {/* Verification Status */}
          <Select
            label="Verification Status"
            variant="orange"
            options={verificationStatusOptions}
            value={verificationStatus}
            onChange={setVerificationStatus}
            placeholder="Select verification status"
            selectClassName="py-4 px-4"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          {/* Risk Rating */}
          <Select
            label="Risk Rating"
            variant="orange"
            options={riskRatingOptions}
            value={riskRating}
            onChange={setRiskRating}
            placeholder="Select risk rating"
            selectClassName="py-4 px-4"
          />
          {/* Risk Notes*/}
          <Textarea
            label="Risk Notes"
            variant="orange"
            placeholder="Enter risk notes"
            value={riskNotes}
            onChange={(e) => setRiskNotes(e.target.value)}
            className="h-[120px]"
            textareaClassName="h-44"
          />
        </div>

        {/* Varified By */}
        <div className="grid grid-cols-2 gap-12">
          <Input
            label="Verified By"
            variant="orange"
            placeholder="Enter name"
            value={verifiedBy}
            onChange={(e) => setVerifiedBy(e.target.value)}
          />
        </div>

        {/* Button */}
        <div className="mt-12 flex justify-center">
          <Button
            className="px-10 rounded-lg"
            onClick={() =>
              router.push("/vendor/vendor-registration/upload-documents")
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorStatus;
