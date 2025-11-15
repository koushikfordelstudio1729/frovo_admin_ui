"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Input,
  Select,
  Button,
  Label,
  Textarea,
  FileUpload,
} from "@/components";

import {
  productOptions,
  agentOptions,
  vendorOptions,
} from "@/config/warehouse";

export default function ExpenseEntryForm() {
  const router = useRouter();
  const [billFile, setBillFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    expenseCategory: "",
    amount: "",
    vendor: "",
    date: "",
    assignedAgent: "",
    description: "",
  });

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Expense Entry Form
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-8">
        {/* Expense Category */}
        <div className="grid grid-cols-2 gap-10 mb-8">
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Expense Category
            </Label>
            <Select
              id="expenseCategory"
              options={vendorOptions}
              value={formData.expenseCategory}
              placeholder="Select Category"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) =>
                setFormData({ ...formData, expenseCategory: val })
              }
            />
          </div>
          {/* Amount*/}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Amount
            </Label>
            <Input
              type="number"
              variant="orange"
              value={formData.amount}
              placeholder="₹12,000"
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-8">
          {/* Vendor */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Vendor
            </Label>
            <Select
              id="vendor"
              options={productOptions}
              value={formData.vendor}
              placeholder="Select Vendor"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) => setFormData({ ...formData, vendor: val })}
            />
          </div>
          {/* Date */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Date
            </Label>
            <Input
              type="date"
              variant="orange"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            {/* Assigned Agent */}
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Assigned Agent
            </Label>
            <Select
              id="assignedAgent"
              options={agentOptions}
              value={formData.assignedAgent}
              placeholder="Select Agent"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) =>
                setFormData({ ...formData, assignedAgent: val })
              }
            />

            {/* Description  */}
            <div className="mt-8">
              <Label className="text-lg font-medium text-gray-700 mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                rows={4}
                variant="orange"
                value={formData.description}
                placeholder="Monthly stock transport cost"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/*  Upload Bill */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Upload Bill
            </Label>
            <FileUpload label="" file={billFile} onChange={setBillFile} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center ">
          <Button variant="primary" size="md" className="rounded-lg">
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
