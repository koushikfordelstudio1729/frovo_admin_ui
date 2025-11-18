"use client";

import { Button, Input, Label } from "@/components";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ContractDetail = () => {
  const router = useRouter();
  const [contractTerms, setContractTerms] = useState("");
  const [contractExpiryDate, setContractExpiryDate] = useState("");
  const [contractRenewalDate, setContractRenewalDate] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with back */}
      <div className="flex items-center gap-3 mt-2">
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
          {/* Contract Terms */}
          <Input
            label="Contract Terms"
            variant="orange"
            placeholder="Enter contract terms"
            value={contractTerms}
            onChange={(e) => setContractTerms(e.target.value)}
          />
          {/* Contract Expiry Date */}
          <Input
            label="Contract Expiry Date"
            variant="orange"
            type="date"
            value={contractExpiryDate}
            onChange={(e) => setContractExpiryDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-12">
          {/* Contract Renewal Date */}
          <Input
            label="Contract Renewal Date"
            variant="orange"
            type="date"
            value={contractRenewalDate}
            onChange={(e) => setContractRenewalDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        {/* Next Button */}
        <div className="mt-12 flex justify-center">
          <Button
            className="px-10 rounded-lg"
            variant="primary"
            onClick={() =>
              router.push("/vendor/vendor-registration/system-access")
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
