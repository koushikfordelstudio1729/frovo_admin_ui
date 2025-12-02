"use client";

import {
  Input,
  Select,
  Button,
  Label,
  Checkbox,
  FileUpload,
  BackHeader,
} from "@/components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { vendorOptions, storageOptions } from "@/config/warehouse";

export default function InboundLogisticsPage() {
  const router = useRouter();
  const [autoFetch, setAutoFetch] = useState(false);
  const [billFile, setBillFile] = useState<File | null>(null);
  const [qcChecks, setQcChecks] = useState({
    packaging: false,
    expiry: false,
    label: false,
  });
  const [formData, setFormData] = useState({
    vendor: "",
    storage: "",
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Back Button */}
      <BackHeader title="Goods Entry Form" />

      {/* Main Form Card */}
      <div className="max-w-full bg-white rounded-2xl p-8">
        {/* Input Fields Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Input
              id="batch"
              label="Batch"
              variant="orange"
              placeholder="Enter batch"
            />
          </div>

          <div>
            <Select
              id="vendor"
              label="Vendor"
              options={vendorOptions}
              value={formData.vendor}
              placeholder="Select vendor"
              selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
              onChange={(val) => setFormData({ ...formData, vendor: val })}
            />
          </div>

          <div>
            <Input
              id="sku"
              label="SKU"
              placeholder="Enter SKU"
              variant="orange"
            />
          </div>

          <div>
            <Input
              id="quantity"
              label="Quantity"
              placeholder="Enter Quantity"
              type="number"
              variant="orange"
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="mb-8">
          <Checkbox
            label=" Auto-fetch SKU details"
            checked={autoFetch}
            onChange={() => setAutoFetch(!autoFetch)}
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* QC Verification */}
            <div>
              <Label className="text-base font-semibold text-gray-900 mb-4 block">
                QC Verification
              </Label>
              <div className="space-y-6">
                <Checkbox
                  label="Packaging"
                  checked={qcChecks.packaging}
                  onChange={() =>
                    setQcChecks((prev) => ({
                      ...prev,
                      packaging: !prev.packaging,
                    }))
                  }
                />
                <Checkbox
                  label="Expiry"
                  checked={qcChecks.expiry}
                  onChange={() =>
                    setQcChecks((prev) => ({ ...prev, expiry: !prev.expiry }))
                  }
                />
                <Checkbox
                  label="Label"
                  checked={qcChecks.label}
                  onChange={() =>
                    setQcChecks((prev) => ({ ...prev, label: !prev.label }))
                  }
                />
              </div>
            </div>

            {/* File Upload */}
            <FileUpload
              label="File Upload"
              file={billFile}
              onChange={setBillFile}
            />
          </div>

          {/* Storage Assignment */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div>
              <Select
                id="storage"
                label="Storage Assignment"
                options={storageOptions}
                value={formData.storage ?? ""}
                placeholder="Select storage location"
                selectClassName="py-3 px-4"
                onChange={(val) => setFormData({ ...formData, storage: val })}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <Button
            className="py-2 px-8 text-xl font-medium rounded-lg"
            variant="primary"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
