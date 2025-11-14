"use client";

import { Input, Select, Button, Label, Checkbox } from "@/components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { vendorOptions, storageOptions } from "@/config/warehouse";

export default function InboundLogisticsPage() {
  const router = useRouter();
  const [autoFetch, setAutoFetch] = useState(false);
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
          Goods Entry Form
        </h1>
      </div>

      {/* Main Form Card */}
      <div className="max-w-full bg-white rounded-2xl p-8">
        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-2 block">
              PO Number
            </Label>
            <Input id="poNumber" variant="orange" />
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-2 block">
              Vendor
            </Label>
            <Select
              id="vendor"
              options={vendorOptions}
              value={formData.vendor}
              placeholder="Select vendor"
              selectClassName="px-6 py-4 border-2 border-orange-300 bg-white text-base"
              onChange={(val) => setFormData({ ...formData, vendor: val })}
            />
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-2 block">
              SKU
            </Label>
            <Input id="sku" variant="orange" />
          </div>

          <div>
            <Label className="text-lg font-semibold text-gray-700 mb-2 block">
              Quantity
            </Label>
            <Input id="quantity" type="number" variant="orange" />
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
            <div className="max-w-xs">
              <Label className="text-base font-semibold text-gray-900 mb-3 block">
                File Upload
              </Label>
              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-orange-300 rounded-xl p-8 cursor-pointer hover:border-orange-400 transition-colors hover:bg-orange-50"
              >
                <input
                  type="file"
                  id="fileUpload"
                  accept=".jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="w-8 h-8 text-orange-500 mb-3 pointer-events-none" />
                <span className="bg-orange-500 px-4 py-1 rounded-lg text-white font-medium pointer-events-none">
                  Upload
                </span>
                <span className="text-xs text-gray-500 mt-4 pointer-events-none">
                  *File Supported: JPG & PDF
                </span>
              </label>
            </div>
          </div>

          {/* Storage Assignment */}
          <div className="bg-gray-50 rounded-xl p-6">
            <Label className="text-xl font-semibold text-gray-900 mb-4 block">
              Storage Assignment
            </Label>
            <div>
              <Select
                id="storage"
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
