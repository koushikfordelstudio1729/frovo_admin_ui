"use client";

import {
  BackHeader,
  Button,
  FileUpload,
  Input,
  Label,
  Select,
  Table,
  Textarea,
} from "@/components";
import { useState } from "react";
import { useRouter } from "next/navigation";

const qcStatusOptions = [
  { label: "Approve", value: "approve" },
  { label: "Pending", value: "pending" },
];

const qcVerificationColumns = [
  { label: "Item Name / SKU", key: "item_sku" },
  { label: "UOM", key: "uom" },
  { label: "Ordered Qty", key: "ordered_qty" },
  { label: "Challan Qty", key: "challan_qty" },
  { label: "Received Qty", key: "receieved_qty" },
  { label: "Accepted Qty", key: "accepted_qty" },
  { label: "Rejected Qty", key: "rejected_qty" },
  { label: "Expiry Date", key: "expiry_date" },
  { label: "Remarks", key: "remarks" },
];

const CreateGRN = () => {
  const [challan, setChallan] = useState<File | null>(null);
  const [damaged, setDamage] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const router = useRouter();

  return (
    <div className="min-h-screen pt-4">
      <BackHeader title="Create New GRN" />
      <div className="max-w-full bg-white rounded-2xl p-8">
        <div className="grid grid-cols-2 gap-12 mb-6">
          <Input
            label="Delivery Challan"
            variant="orange"
            placeholder="Enter Delivery Challan"
          />
          <Input
            label="Transporter Name"
            variant="orange"
            placeholder="Enter Transporter Name"
          />
        </div>
        <div className="grid grid-cols-2 gap-12">
          <Input
            label="Vehicle Number"
            variant="orange"
            placeholder="Enter Vehicle Number"
          />
          <Input label="Received Date" variant="orange" type="date" />
        </div>
        <div className="border-2 my-18"></div>
        <div className="relative">
          <div className="overflow-x-auto">
            <Table
              columns={qcVerificationColumns}
              data={qcVerificationColumns}
            />
          </div>
        </div>
        <div className="border-2 my-18"></div>
        <div className="flex justify-center">
          <Label className="text-2xl font-bold">Documentation</Label>
        </div>
        <div className="w-2xl grid grid-cols-2 gap-12 mt-12">
          <FileUpload
            label="Scanned Challan"
            file={challan}
            onChange={setChallan}
          />
          <FileUpload
            label="Damaged Proof"
            file={damaged}
            onChange={setDamage}
          />
        </div>
        <div className="grid grid-cols-2 gap-12 mt-12">
          <Select
            label="QC Status"
            variant="orange"
            selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
            options={qcStatusOptions}
            value={status}
            onChange={setStatus}
          />
          <Textarea
            label="Remarks / Notes"
            variant="orange"
            placeholder="Enter any additional notes..."
            rows={5}
            textareaClassName="w-lg"
          />
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
            Save Draft
          </Button>
          <Button
            className="rounded-lg px-8"
            type="button"
            variant="red"
            size="lg"
            onClick={router.back}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGRN;
