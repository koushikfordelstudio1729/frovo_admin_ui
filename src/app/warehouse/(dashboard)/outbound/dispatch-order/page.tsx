"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Input, Select, Button, Label, Textarea } from "@/components";
import { vendorOptions } from "@/config/warehouse";
import { productOptions, agentOptions } from "@/config/warehouse";

export default function DispatchOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dispatchId: "",
    vendor: "",
    productSku: "",
    quantity: "",
    assignedAgent: "",
    notes: "",
  });

  return (
    <div className="min-h-full bg-gray-50 p-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 my-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dispatch Order Form
        </h1>
      </div>

      <div className="max-w-full bg-white rounded-2xl p-8">
        <div className="grid grid-cols-2 gap-18 mb-6">
          {/* Dispatch ID */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Dispatch ID
            </Label>
            <Input
              id="dispatchId"
              variant="orange"
              value={formData.dispatchId}
              onChange={(e) =>
                setFormData({ ...formData, dispatchId: e.target.value })
              }
              placeholder="Enter dispatch id"
            />
          </div>
          {/* Vendor / Destination */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Vendor / Destination
            </Label>
            <Select
              id="vendor"
              options={vendorOptions}
              value={formData.vendor}
              placeholder="Select Vendor"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) => setFormData({ ...formData, vendor: val })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-18 mb-6">
          {/* Product SKU  */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Product SKU
            </Label>
            <Select
              id="productSku"
              options={productOptions}
              value={formData.productSku}
              placeholder="SKU ID / Name"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) => setFormData({ ...formData, productSku: val })}
            />
          </div>
          {/* Quantity */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              variant="orange"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Enter quantity"
              className="w-full"
            />
          </div>
        </div>

        {/* Assigned Agent */}
        <div className="mb-6">
          <Label className="text-lg font-medium text-gray-700 mb-2 block">
            Assigned Agent
          </Label>
          <Select
            id="assignedAgent"
            options={agentOptions}
            value={formData.assignedAgent}
            placeholder="Select agent name"
            className="w-lg"
            selectClassName="py-4 px-4 border-2 border-orange-300"
            onChange={(val) => setFormData({ ...formData, assignedAgent: val })}
          />
        </div>

        {/* Dispatch Notes */}
        <div className="mb-8">
          <Label
            htmlFor="notes"
            className="text-lg font-medium text-gray-700 mb-2 block"
          >
            Dispatch Notes
          </Label>
          <Textarea
            id="notes"
            label={undefined}
            variant="orange"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Enter any additional notes..."
            rows={5}
            textareaClassName="w-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            className="rounded-lg"
            type="submit"
            variant="primary"
            size="lg"
          >
            Create Dispatch
          </Button>
          <Button
            className="rounded-lg"
            type="button"
            variant="secondary"
            size="lg"
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
