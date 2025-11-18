"use client";

import { Button, Input, Label, Select } from "@/components";
import FileUpload from "@/components/common/FileUpload";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const documentTypeOptions = [
  { label: "Signed Contract", value: "signed_contract" },
  { label: "GST ", value: "gst" },
  { label: "MSME", value: "msme" },
  { label: "TDS Exemption", value: "tds_exemption" },
];

const VendorUploadDocuments = () => {
  const router = useRouter();
  const [documentType, setDocumentType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
          {/* Document Type */}
          <Select
            label="Document Type"
            variant="orange"
            options={documentTypeOptions}
            value={documentType}
            onChange={setDocumentType}
            placeholder="Select document type"
            selectClassName="py-4 px-4"
          />
          {/* Expiry Date */}
          <Input
            label="Expiry Date"
            variant="orange"
            value={expiryDate}
            type="date"
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="Select expiry date"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        {/* File Upload */}
        <div className="mt-6 flex flex-col gap-1">
          <Label>File Upload</Label>
          <FileUpload
            file={file}
            onChange={setFile}
            accept=".jpg,.jpeg,.png,.pdf"
          />
        </div>
        {/* Next Button */}
        <div className="mt-12 flex justify-center">
          <Button
            className="px-10 rounded-lg"
            variant="primary"
            onClick={() =>
              router.push("/vendor/vendor-registration/contract-details")
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorUploadDocuments;
