"use client";

import { useState } from "react";
import { BackHeader, Button, Label } from "@/components";
import { useRouter } from "next/navigation";
import { bulkCreateVendors } from "@/services/vendor";
import { toast } from "react-hot-toast";
import { CreateVendorPayload } from "@/types/vendor-data.types";
import {
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function BulkUploadVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [results, setResults] = useState<{
    successful: number;
    failed: number;
    details: any[];
  } | null>(null);

  const sampleData: CreateVendorPayload[] = [
    {
      vendor_name: "Sample Brand 1",
      vendor_billing_name: "Sample Brand 1 Pvt Ltd",
      vendor_type: ["snacks"],
      vendor_category: "consumables",
      material_categories_supplied: ["Chips", "Snacks"],
      primary_contact_name: "John Doe",
      contact_phone: "+919876543210",
      vendor_email: "brand@example.com",
      vendor_address: "123 Sample Street, City, State - 123456",
      cin: "U15499DL1989PTC035955",
      bank_account_number: "1234567890123456",
      ifsc_code: "HDFC0001234",
      payment_terms: "net_30",
      payment_methods: "neft",
      gst_number: "07AABCP0634E1Z1",
      pan_number: "AABCP0634E",
      tds_rate: 1.0,
      billing_cycle: "monthly",
      risk_rating: "low",
      risk_notes: "Good brand",
      contract_expiry_date: "2025-12-31",
      contract_renewal_date: "2025-11-30",
    },
  ];

  const handleDownloadSample = () => {
    const dataStr = JSON.stringify({ vendors: sampleData }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendor-bulk-upload-sample.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
      toast.error("Please upload a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.vendors || !Array.isArray(parsed.vendors)) {
          toast.error('JSON must have a "brands" array');
          return;
        }

        setJsonData(JSON.stringify(parsed, null, 2));
        toast.success(`Loaded ${parsed.vendors.length} brands from file`);
      } catch (error) {
        toast.error("Invalid JSON file");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!jsonData.trim()) {
      return toast.error("Please provide brands data");
    }

    try {
      const parsed = JSON.parse(jsonData);

      if (!parsed.vendors || !Array.isArray(parsed.vendors)) {
        return toast.error('JSON must have a "brands" array');
      }

      if (parsed.vendors.length === 0) {
        return toast.error("brands array cannot be empty");
      }

      setLoading(true);
      const res = await bulkCreateVendors(parsed);

      const { successful, failed } = res.data.data;
      setResults({
        successful: successful.length,
        failed: failed.length,
        details: [...successful, ...failed],
      });

      if (failed.length === 0) {
        toast.success(`All ${successful.length} brands created successfully!`);
      } else {
        toast(`${successful.length} brands created, ${failed.length} failed`, {
          style: {
            border: "1px solid #facc15",
            padding: "12px",
            color: "#92400e",
          },
        });
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to bulk create brands";
      toast.error(msg);
      console.error("Bulk Upload Error →", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title="Bulk Upload brands" />

      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Label className="text-xl font-semibold text-blue-700 flex items-center gap-2">
            <AlertCircle size={24} />
            Instructions
          </Label>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
            <li>Download the sample JSON template below</li>
            <li>Fill in your brand data following the same structure</li>
            <li>Upload the JSON file or paste the JSON content directly</li>
            <li>Click "Upload Brands" to process the bulk creation</li>
            <li>
              Review the results to see which brands were created successfully
            </li>
          </ul>
        </div>

        {/* Download Sample */}
        <div className="flex justify-between items-center">
          <Label className="text-xl font-semibold">
            Download Sample Template
          </Label>
          <Button
            variant="secondary"
            onClick={handleDownloadSample}
            className="flex items-center gap-2 rounded-lg"
          >
            <Download size={18} />
            Download Sample JSON
          </Button>
        </div>

        <hr className="border-gray-200" />

        {/* Upload Options */}
        <Label className="text-xl font-semibold">Upload Brands Data</Label>

        <div className="grid grid-cols-1 gap-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Option 1: Upload JSON File
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
              />
            </div>
          </div>

          {/* JSON Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Option 2: Paste JSON Content
            </label>
            <textarea
              className="w-full h-96 px-4 text-gray-900 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              placeholder='{"Brands": [...]}'
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !jsonData.trim()}
            className="px-8 rounded-lg flex items-center gap-2"
          >
            <Upload size={18} />
            {loading ? "Uploading..." : "Upload Brands"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="px-8 rounded-lg"
          >
            Cancel
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-8 space-y-4">
            <hr className="border-gray-200" />
            <Label className="text-xl font-semibold">Upload Results</Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 size={32} className="text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {results.successful}
                  </p>
                  <p className="text-sm text-green-600">Successful</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <XCircle size={32} className="text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-700">
                    {results.failed}
                  </p>
                  <p className="text-sm text-red-600">Failed</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6">
              <Label className="text-lg font-semibold mb-4">
                Detailed Results
              </Label>
              <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Brand Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Brand ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.details.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.vendor_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {item.vendor_id || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.error ? (
                            <span className="text-red-600 font-semibold">
                              Failed
                            </span>
                          ) : (
                            <span className="text-green-600 font-semibold">
                              Success
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.error || "Created successfully"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                variant="primary"
                onClick={() => router.push("/vendor/vendor-onboard")}
                className="px-8 rounded-lg"
              >
                Go to Brand List
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
