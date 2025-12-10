"use client";

import { Button, Input, Label, Select, Textarea } from "@/components";
import FileUpload from "@/components/common/FileUpload";
import { createVendor } from "@/services/vendor";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Dropdown options
const vendorTypeOptions = [
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
  { label: "Packaging", value: "packaging" },
  { label: "Services", value: "services" },
  { label: "Raw Materials", value: "raw_materials" },
  { label: "Equipment", value: "equipment" },
  { label: "Maintenance", value: "maintenance" },
];

const vendorCategoryOptions = [
  { label: "Consumables", value: "consumables" },
  { label: "Packaging", value: "packaging" },
  { label: "Logistics", value: "logistics" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Services", value: "services" },
  { label: "Equipment", value: "equipment" },
];

const paymentTermsOptions = [
  { label: "Net 7", value: "net7" },
  { label: "Net 15", value: "net15" },
  { label: "Net 30", value: "net30" },
];

const billingCycleOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Per PO", value: "per_po" },
];

const statusCycleOptions = [
  { label: "Procurement", value: "procurement" },
  { label: "Restocking", value: "restocking" },
  { label: "Finance Reconciliation", value: "finance_reconciliation" },
  { label: "Audit", value: "audit" },
];

const verificationStatusOptions = [
  { label: "Pending Verification", value: "pending_verification" },
  { label: "Verified", value: "verified" },
  { label: "Failed", value: "failed" },
  { label: "Rejected", value: "rejected" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const documentTypeOptions = [
  { label: "Signed Contract", value: "signed_contract" },
  { label: "GST", value: "gst" },
  { label: "MSME", value: "msme" },
  { label: "TDS Exemption", value: "tds_exemption" },
];

const paymentMethodOptions = [
  { label: "NEFT", value: "neft" },
  { label: "IMPS", value: "imps" },
  { label: "UPI", value: "upi" },
  { label: "Corp Wallet", value: "corp_wallet" },
];

type DocumentItem = {
  documentType: string;
  expiryDate: string;
  file: File | null;
};

const blankDocument: DocumentItem = {
  documentType: "",
  expiryDate: "",
  file: null,
};

const VendorRegistrationFull = () => {
  const router = useRouter();

  // Vendor Details
  const [vendorName, setVendorName] = useState("");
  const [vendorBillingName, setVendorBillingName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [vendorType, setVendorType] = useState("");
  const [vendorCategory, setVendorCategory] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  // Finance & Compliance
  const [baVendor, setBaVendor] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [gstDetails, setGstDetails] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [tdsRate, setTdsRate] = useState("");
  const [billingCycle, setBillingCycle] = useState("");

  // Status
  const [statusCycle, setStatusCycle] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [riskRating, setRiskRating] = useState("");
  const [riskNotes, setRiskNotes] = useState("");
  const [verifiedBy, setVerifiedBy] = useState("");

  // Documents & Contract
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { ...blankDocument },
  ]);
  const [contractTerms, setContractTerms] = useState("");
  const [contractExpiryDate, setContractExpiryDate] = useState("");
  const [contractRenewalDate, setContractRenewalDate] = useState("");

  // System Access
  const [paymentMethod, setPaymentMethod] = useState("");
  const [operationsManager, setOperationsManager] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Document handlers
  const handleDocumentChange = (
    idx: number,
    field: keyof DocumentItem,
    value: string | File | null
  ) => {
    setDocuments((docs) => {
      const updated = [...docs];
      updated[idx] = { ...updated[idx], [field]: value } as DocumentItem;
      return updated;
    });
  };

  const handleAddMoreDocument = () => {
    setDocuments((docs) => [...docs, { ...blankDocument }]);
  };

  const handleDeleteDocument = (idx: number) => {
    setDocuments((docs) => docs.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    console.log("Save draft payload", {
      vendorName,
      vendorBillingName,
      vendorId,
      vendorType,
      vendorCategory,
      primaryContact,
      contactPhone,
      vendorEmail,
      billingAddress,
      baVendor,
      ifscCode,
      paymentTerms,
      gstDetails,
      panNumber,
      tdsRate,
      billingCycle,
      statusCycle,
      verificationStatus,
      riskRating,
      riskNotes,
      verifiedBy,
      documents,
      contractTerms,
      contractExpiryDate,
      contractRenewalDate,
      paymentMethod,
      operationsManager,
      internalNotes,
    });
  };

  const handleSubmit = async () => {
   
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => router.back()}
          type="button"
          className="cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <Label className="text-2xl font-semibold">Vendor Details</Label>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg">
        {/* Vendor Details */}
        <Label className="text-orange-500 text-2xl font-semibold">
          Vendor Details
        </Label>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="CIN Number"
            variant="orange"
            placeholder="Enter CIN number"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
          />
          <Input
            label="Vendor Name"
            variant="orange"
            placeholder="Enter vendor name"
            value={vendorBillingName}
            onChange={(e) => setVendorBillingName(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="Vendor Billing Name"
            variant="orange"
            placeholder="Enter Billing Name"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
          />
          <Input
            label="Email ID of Vendor"
            variant="orange"
            placeholder="Enter vendor email ID"
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="Vendor ID"
            variant="orange"
            placeholder="Enter vendor ID"
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
          />
          <Select
            label="Vendor Type"
            variant="orange"
            options={vendorTypeOptions}
            value={vendorType}
            onChange={setVendorType}
            placeholder="Select vendor type"
            selectClassName="py-4 px-4"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Select
            label="Vendor Category"
            variant="orange"
            options={vendorCategoryOptions}
            value={vendorCategory}
            onChange={setVendorCategory}
            placeholder="Select vendor category"
            selectClassName="py-4 px-4"
          />
          <Input
            label="Primary Contact Name"
            variant="orange"
            placeholder="Enter primary contact name"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="Contact Phone"
            variant="orange"
            placeholder="Enter contact phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <Textarea
            label="Address (Billing)"
            variant="orange"
            placeholder="Enter billing address"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
          />
        </div>

        {/* Finance & Compliance */}
        <div className="w-full border-2 my-12" />
        <Label className="text-orange-500 text-2xl font-semibold">
          Finance
        </Label>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="Bank Account of Vendor"
            variant="orange"
            placeholder="Enter Bank Account of Vendor"
            value={baVendor}
            onChange={(e) => setBaVendor(e.target.value)}
          />
          <Input
            label="Vendor Billing Name"
            variant="orange"
            placeholder="Enter vendor billing name"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
          />
        </div>

        <div className="mt-6 w-lg">
          <Select
            label="Payment Terms"
            variant="orange"
            options={paymentTermsOptions}
            value={paymentTerms}
            onChange={setPaymentTerms}
            selectClassName="py-4 px-4"
          />
        </div>

        <div className="w-full border-2 my-12" />
        <Label className="text-orange-500 text-2xl font-semibold">
          Compliance
        </Label>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="GST Details"
            variant="orange"
            placeholder="Enter GST details"
            value={gstDetails}
            onChange={(e) => setGstDetails(e.target.value)}
          />
          <Input
            label="PAN Number"
            variant="orange"
            placeholder="Enter PAN number"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="TDS Rate (%)"
            variant="orange"
            placeholder="Enter TDS Rate"
            value={tdsRate}
            onChange={(e) => setTdsRate(e.target.value)}
          />
          <Select
            label="Billing Cycle"
            variant="orange"
            options={billingCycleOptions}
            value={billingCycle}
            onChange={setBillingCycle}
            placeholder="Select Billing Cycle"
            selectClassName="py-4 px-4"
          />
        </div>

        {/* Status */}
        <div className="w-full border-2 my-12" />
        <Label className="text-orange-500 text-2xl font-semibold">Status</Label>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Select
            label="Vendor Status Cycle"
            variant="orange"
            options={statusCycleOptions}
            value={statusCycle}
            onChange={setStatusCycle}
            placeholder="Select vendor status cycle"
            selectClassName="py-4 px-4"
          />
          <Select
            label="Verification Status"
            variant="orange"
            options={verificationStatusOptions}
            value={verificationStatus}
            onChange={setVerificationStatus}
            placeholder="Select verification status"
            selectClassName="py-4 px-4"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Select
            label="Risk Rating"
            variant="orange"
            options={riskRatingOptions}
            value={riskRating}
            onChange={setRiskRating}
            placeholder="Select risk rating"
            selectClassName="py-4 px-4"
          />
          <Textarea
            label="Risk Notes"
            variant="orange"
            placeholder="Enter risk notes"
            value={riskNotes}
            onChange={(e) => setRiskNotes(e.target.value)}
            className="h-[120px]"
            textareaClassName="h-44"
          />
        </div>

        <div className="grid grid-cols-2 gap-12">
          <Input
            label="Verified By"
            variant="orange"
            placeholder="Enter name"
            value={verifiedBy}
            onChange={(e) => setVerifiedBy(e.target.value)}
          />
        </div>

        {/* Documents */}
        <div className="w-full border-2 my-12" />
        <Label className="text-orange-500 text-2xl font-semibold">
          Documents
        </Label>

        <div>
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 items-end mt-6 gap-12 border-b border-orange-200 pb-6 mb-4"
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
                min={today}
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

        <Button
          type="button"
          variant="primary"
          className="text-orange-500 mt-2 rounded-lg"
          onClick={handleAddMoreDocument}
        >
          + Add More
        </Button>

        {/* Contract Details */}
        <div className="w-full border-2 my-12" />
        <Label className="text-orange-500 text-2xl font-semibold">
          Contract Detail
        </Label>

        <div className="mt-6 grid grid-cols-2 gap-12">
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
            min={today}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Input
            label="Contract Renewal Date"
            variant="orange"
            type="date"
            value={contractRenewalDate}
            onChange={(e) => setContractRenewalDate(e.target.value)}
            min={today}
          />
        </div>

        {/* System Access */}
        <div className="w-full border-2 my-12" />
        <Label className="text-orange-500 text-2xl font-semibold">
          System Access
        </Label>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Select
            label="Payment Method"
            variant="orange"
            options={paymentMethodOptions}
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="Select payment method"
            selectClassName="py-4 px-4"
          />
          <Input
            label="Operations Manager"
            variant="orange"
            value={operationsManager}
            onChange={(e) => setOperationsManager(e.target.value)}
            placeholder="Enter Name"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-12">
          <Textarea
            label="Internal Notes"
            variant="orange"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Enter internal notes"
            rows={5}
            className="min-h-[120px]"
          />
        </div>

        {/* Footer Buttons */}
        <div className="mt-12 flex justify-center gap-6">
          <Button
            className="px-10 rounded-lg"
            variant="secondary"
            type="button"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            className="px-10 rounded-lg"
            variant="primary"
            type="button"
            onClick={handleSubmit}
          >
            Submit for approval
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationFull;
