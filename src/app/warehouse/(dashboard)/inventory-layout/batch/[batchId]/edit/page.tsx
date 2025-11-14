"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, Label } from "@/components";
import EditableInput from "@/components/common/EditableInput";
import AgeRangeSelect from "@/components/age-range-select/AgeRangeSelect";

export default function BatchEditPage() {
  const router = useRouter();
  const params = useParams();
  const batchId = params.batchId as string;

  const [formData, setFormData] = useState({
    batchId: "Batch - 102",
    sku: "SNACKS - 45",
    quantity: "343",
    age: ">60",
    expiry: "22-11-2025",
  });

  const [isEditing, setIsEditing] = useState({
    batchId: false,
    sku: false,
    expiry: false,
    quantity: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Updated batch data:", formData);
    router.push("/warehouse/inventory-layout");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-3 mt-2">
          <button onClick={() => router.back()} type="button">
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <Label className="text-xl font-semibold">{batchId} Edit</Label>
        </div>
      </div>

      <div className="mx-auto">
        <div className="bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EditableInput
              id="batchId"
              label="Batch ID"
              value={formData.batchId}
              isEditing={isEditing.batchId}
              onChange={(val) => handleInputChange("batchId", val)}
              toggleEdit={() =>
                setIsEditing((prev) => ({
                  ...prev,
                  batchId: !prev.batchId,
                }))
              }
            />

            <EditableInput
              id="sku"
              label="SKU"
              value={formData.sku}
              isEditing={isEditing.sku}
              onChange={(val) => handleInputChange("sku", val)}
              toggleEdit={() =>
                setIsEditing((prev) => ({
                  ...prev,
                  sku: !prev.sku,
                }))
              }
            />

            <div>
              <EditableInput
                id="quantity"
                label="Quantity"
                value={formData.quantity}
                isEditing={isEditing.quantity}
                onChange={(val) => handleInputChange("quantity", val)}
                toggleEdit={() =>
                  setIsEditing((prev) => ({
                    ...prev,
                    quantity: !prev.quantity,
                  }))
                }
              />
            </div>

            <div>
              <Label>Age</Label>
              <AgeRangeSelect
                value={formData.age}
                onChange={(val) => handleInputChange("age", val)}
                borderColor="border-orange-200"
              />
            </div>

            <div>
              <EditableInput
                id="expiry"
                label="Expiry"
                value={formData.expiry}
                placeholder="DD-MM-YYYY"
                isEditing={isEditing.expiry}
                onChange={(val) => handleInputChange("expiry", val)}
                toggleEdit={() =>
                  setIsEditing((prev) => ({
                    ...prev,
                    expiry: !prev.expiry,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <Button
              className="rounded-md px-8"
              variant="primary"
              size="md"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
            <Button
              className="rounded-md px-8"
              variant="secondary"
              size="md"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
