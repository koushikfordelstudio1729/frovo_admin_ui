"use client";

import { Button, Input, Label, Select } from "@/components";
import FileUpload from "@/components/common/FileUpload";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const documentTypeOptions = [
  { label: "Signed Contract", value: "signed_contract" },
  { label: "GST ", value: "gst" },
  { label: "MSME", value: "msme" },
  { label: "TDS Exemption", value: "tds_exemption" },
];

const blankDocument = {
  documentType: "",
  expiryDate: "",
  file: null,
};

const VendorDocumentsAndContract = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState([{ ...blankDocument }]);
  const [contractTerms, setContractTerms] = useState("");
  const [contractExpiryDate, setContractExpiryDate] = useState("");
  const [contractRenewalDate, setContractRenewalDate] = useState("");

  // Handle document field change
  const handleDocumentChange = (
    idx: number,
    field: string,
    value: string | File | null
  ) => {
    setDocuments((docs) => {
      const updated = [...docs];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  // Add more document
  const handleAddMoreDocument = () => {
    setDocuments((docs) => [...docs, { ...blankDocument }]);
  };

  // Delete a document block
  const handleDeleteDocument = (idx: number) => {
    setDocuments((docs) => docs.filter((_, i) => i !== idx));
  };

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
        <Label className="text-2xl font-semibold">Documents & Contracts</Label>
      </div>
      <div className="max-h-full mt-6 p-6 bg-white rounded-lg">
        {/* Document Section */}
        <Label className="text-orange-500 text-2xl font-semibold">
          Documents
        </Label>

        {/* Dynamic document blocks */}
        <div>
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 items-end mt-6 gap-12 border-b border-orange-200 pb-6 mb-4 relative"
            >
              <Select
                label="Document Type"
                variant="orange"
                options={documentTypeOptions}
                value={doc.documentType}
                onChange={(val) =>
                  handleDocumentChange(idx, "documentType", val)
                }
                placeholder="Select document type"
                selectClassName="py-4 px-4"
              />
              <Input
                label="Expiry Date"
                variant="orange"
                value={doc.expiryDate}
                type="date"
                onChange={(e) =>
                  handleDocumentChange(idx, "expiryDate", e.target.value)
                }
                placeholder="Select expiry date"
                min={new Date().toISOString().split("T")[0]}
              />
              <div className="col-span-1 flex flex-col gap-1 mt-4">
                <Label>File Upload</Label>
                <FileUpload
                  file={doc.file}
                  onChange={(file) => handleDocumentChange(idx, "file", file)}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </div>
              <div className="col-span-1 flex items-center mt-8">
                {documents.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    title="Remove this document"
                    onClick={() => handleDeleteDocument(idx)}
                    className="ml-auto px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add More Button */}
        <button
          type="button"
          className="text-orange-500 mt-2 underline"
          onClick={handleAddMoreDocument}
        >
          + Add More
        </button>

        {/* Seperator Line */}
        <div className="w-full border-2 my-12"></div>
        <Label className="text-orange-500 text-2xl font-semibold">
          Contract Details
        </Label>
        <div className="grid grid-cols-2 mt-6 gap-12">
          <Input
            label="Contract Terms"
            variant="orange"
            placeholder="Enter contract terms"
            value={contractTerms}
            onChange={(e) => setContractTerms(e.target.value)}
          />
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

export default VendorDocumentsAndContract;
