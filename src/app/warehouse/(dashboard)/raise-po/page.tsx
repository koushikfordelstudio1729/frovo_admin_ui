"use client";

import { BackHeader, Button, Input, Select, Textarea } from "@/components";

import { useState } from "react";

const poStatusOptions = [
  { label: "Approve", value: "approve" },
  { label: "Pending", value: "pending" },
  { label: "Draft", value: "draft" },
];

export const vendorOptions = [
  { label: "Vendor A", value: "vendor_a" },
  { label: "Vendor B", value: "vendor_b" },
  { label: "Vendor C", value: "vendor_c" },
];

const RaisePO = () => {
  const [status, setStatus] = useState("");
  const [vendor, setVendor] = useState("");
  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      {/* Header with Back Button */}
      <BackHeader title="Raise Puchase Order" />
      <div className="max-w-full bg-white rounded-2xl p-8">
        <div className="grid grid-cols-2 gap-12 mb-6">
          <div>
            <Select
              id="status"
              label="PO Status"
              placeholder="Select PO Status"
              selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
              options={poStatusOptions}
              value={status}
              onChange={setStatus}
            />
          </div>
          <div>
            <Input label="PO Raise Date" variant="orange" type="date" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12 mb-6">
          <div>
            <Select
              id="Vendors"
              label="Vendors"
              placeholder="Select Vendors"
              selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
              options={vendorOptions}
              value={vendor}
              onChange={setVendor}
            />
          </div>
          <div>
            <Textarea
              label="Remarks / Notes"
              variant="orange"
              placeholder="Enter any additional notes..."
              rows={5}
              textareaClassName="w-lg"
            />
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-18 flex justify-center gap-4">
          <Button
            className="rounded-lg px-8"
            type="submit"
            variant="primary"
            size="lg"
          >
            Submit
          </Button>
          <Button
            className="rounded-lg px-8"
            type="button"
            variant="secondary"
            size="lg"
          >
            Draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RaisePO;
