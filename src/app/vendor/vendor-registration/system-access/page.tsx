"use client";

import { Button, Input, Label, Select, Textarea, Toggle } from "@/components";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const paymentMethodOptions = [
  { label: "NEFT", value: "neft" },
  { label: "IMPS ", value: "imps" },
  { label: "UPI", value: "upi" },
  { label: "Corp Wallet ", value: "corp_wallet" },
];

const SystemAccess = () => {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [enableVendorPortal, setEnableVendorPortal] = useState(false);
  const [operationsManager, setOperationsManager] = useState(
    "Ramesh ( Operations Manager )"
  );
  const [internalNotes, setInternalNotes] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <Label className="text-2xl font-semibold">Vendor Registration</Label>
      </div>

      {/* Card */}
      <div className="mt-6 p-6 bg-white rounded-lg">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-12">
          <Select
            label="Payment Method"
            variant="orange"
            options={paymentMethodOptions}
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="Select payment method"
            selectClassName="py-4 px-4"
          />

          {/* Toggle wrapped properly */}
          <div className="flex flex-col">
            <Label className="mb-2">Enable Vendor Portal</Label>

            <div className="flex items-center gap-3">
              <Toggle
                enabled={enableVendorPortal}
                onChange={setEnableVendorPortal}
              />
              <span className="text-gray-600">Yes / No</span>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="Operations Manager"
            variant="orange"
            value={operationsManager}
            onChange={(e) => setOperationsManager(e.target.value)}
            placeholder="Name (Role)"
          />

          <Textarea
            label="Internal Notes"
            variant="orange"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Enter internal notes"
            rows={5}
            className="min-h-[120px]"
          />
        </div>

        {/* Footer Buttons */}
        <div className="mt-12 flex justify-center gap-6">
          <Button className="px-10 rounded-lg" variant="secondary">
            Save
          </Button>

          <Button
            className="px-10 rounded-lg"
            variant="primary"
            onClick={() => {}}
          >
            Submit for approval
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemAccess;
