"use client";

import { useState, useEffect } from "react";
import {
  BackHeader,
  Button,
  Badge,
  Label,
  Select,
  Textarea,
  ConfirmDialog,
} from "@/components";
import { useRouter, useParams } from "next/navigation";
import {
  getVendorById,
  verifyVendor,
  uploadVendorDocument,
  getVendorDocuments,
  deleteVendorDocument,
} from "@/services/vendor";
import { toast } from "react-hot-toast";
import { Vendor } from "@/types/vendor-data.types";
import {
  Edit2,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  History,
} from "lucide-react";

interface VendorDocument {
  _id: string;
  document_name: string;
  document_type: string;
  file_url: string;
  cloudinary_public_id: string;
  file_size: number;
  mime_type: string;
  expiry_date?: string;
  uploaded_at: string;
}

export default function ViewVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("");
  const [uploadExpiry, setUploadExpiry] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    documentId: string;
    documentName: string;
  }>({ open: false, documentId: "", documentName: "" });

  const loadVendor = async () => {
    try {
      setLoading(true);
      const res = await getVendorById(vendorId);
      setVendor(res.data.data);
    } catch (error: any) {
      toast.error("Failed to load vendor details");
      console.error(error);
      router.push("/vendor/vendor-onboard");
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const res = await getVendorDocuments(vendorId);
      setDocuments(res.data.data);
    } catch (error) {
      console.error("Failed to load documents", error);
    }
  };

  useEffect(() => {
    if (vendorId) {
      loadVendor();
      loadDocuments();
    }
  }, [vendorId, router]);

  const handleVerify = async () => {
    if (!verificationStatus) {
      return toast.error("Please select a verification status");
    }

    try {
      setVerifying(true);
      await verifyVendor(vendorId, {
        verification_status: verificationStatus as any,
        notes: verificationNotes,
      });
      toast.success("Brand verification status updated successfully");
      setShowVerificationModal(false);
      setVerificationStatus("");
      setVerificationNotes("");
      loadVendor();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update verification status"
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!uploadFile) {
      return toast.error("Please select a file");
    }
    if (!uploadType) {
      return toast.error("Please select document type");
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("document_type", uploadType);
      if (uploadExpiry) {
        formData.append("expiry_date", uploadExpiry);
      }

      await uploadVendorDocument(vendorId, formData);
      toast.success("Document uploaded successfully");
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadType("");
      setUploadExpiry("");
      loadDocuments();
      loadVendor();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to upload document"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await deleteVendorDocument(vendorId, deleteDialog.documentId);
      toast.success("Document deleted successfully");
      setDeleteDialog({ open: false, documentId: "", documentName: "" });
      loadDocuments();
      loadVendor();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete document"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading Brands Details...
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Brands not found</p>
      </div>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 col-span-2">{value || "—"}</dd>
    </div>
  );

  const getStatusBadge = (
    status: string,
    type: "status" | "verification" | "risk"
  ) => {
    if (type === "status") {
      return status === "active" ? "active" : "rejected";
    }
    if (type === "verification") {
      if (status === "verified" || status === "approved") return "active";
      if (status === "pending" || status === "in-review") return "warning";
      return "rejected";
    }
    if (type === "risk") {
      if (status === "low") return "active";
      if (status === "medium") return "warning";
      return "rejected";
    }
    return "warning";
  };

  const documentTypes = [
    { label: "GST Certificate", value: "gst_certificate" },
    { label: "PAN Card", value: "pan_card" },
    { label: "Bank Statement", value: "bank_statement" },
    { label: "License", value: "license" },
    { label: "Certificate", value: "certificate" },
    { label: "Other", value: "other" },
  ];

  const verificationStatusOptions = [
    { label: "Verified", value: "verified" },
    { label: "Approved", value: "approved" },
    { label: "In Review", value: "in-review" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title="Brand Details" />

      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vendor.vendor_name}
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              {vendor.vendor_billing_name}
            </p>
            <div className="flex gap-3 mt-3">
              <Badge
                label={vendor.vendor_status.toUpperCase()}
                variant={getStatusBadge(vendor.vendor_status, "status")}
              />
              <Badge
                label={vendor.verification_status.toUpperCase()}
                variant={getStatusBadge(
                  vendor.verification_status,
                  "verification"
                )}
              />
              <Badge
                label={`${vendor.risk_rating.toUpperCase()} RISK`}
                variant={getStatusBadge(vendor.risk_rating, "risk")}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowVerificationModal(true)}
              className="flex items-center gap-2 rounded-lg"
            >
              {vendor.verification_status === "verified" ? (
                <CheckCircle size={18} />
              ) : (
                <Clock size={18} />
              )}
              Update Verification
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/vendor/vendor-management/audit/${vendor._id}`)
              }
              className="flex items-center gap-2 rounded-lg"
            >
              <History size={18} />
              Audit Trail
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                router.push(`/vendor/vendor-management/edit/${vendor._id}`)
              }
              className="flex items-center gap-2 rounded-lg"
            >
              <Edit2 size={18} />
              Edit Brand
            </Button>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="text-orange-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Brand ID</p>
                <p className="text-xl font-bold text-gray-900">
                  {vendor.vendor_id}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Payment Terms</p>
                <p className="text-xl font-bold text-gray-900">
                  {vendor.payment_terms.replace("_", " ").toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <Label className="text-xl font-semibold text-orange-500 mb-4 block">
            Basic Information
          </Label>
          <dl className="space-y-0">
            <InfoRow label="Brand Name" value={vendor.vendor_name} />
            <InfoRow label="Billing Name" value={vendor.vendor_billing_name} />
            <InfoRow
              label="Brand Type"
              value={vendor.vendor_type.join(", ").toUpperCase()}
            />
            <InfoRow
              label="Category"
              value={
                vendor.vendor_category === "raw_materials"
                  ? "Raw Materials"
                  : vendor.vendor_category.charAt(0).toUpperCase() +
                    vendor.vendor_category.slice(1)
              }
            />
            <InfoRow
              label="Material Categories"
              value={vendor.material_categories_supplied?.join(", ") || "—"}
            />
            <InfoRow label="CIN" value={vendor.cin} />
            <InfoRow
              label="Warehouse ID"
              value={vendor.warehouse_id || "N/A"}
            />
          </dl>
        </div>

        <hr className="border-gray-200" />

        {/* Contact Information */}
        <div>
          <Label className="text-xl font-semibold text-orange-500 mb-4 block">
            Contact Information
          </Label>
          <dl className="space-y-0">
            <InfoRow
              label="Primary Contact"
              value={vendor.primary_contact_name}
            />
            <InfoRow label="Phone" value={vendor.contact_phone} />
            <InfoRow label="Email" value={vendor.vendor_email} />
            <InfoRow label="Address" value={vendor.vendor_address} />
          </dl>
        </div>

        <hr className="border-gray-200" />

        {/* Financial Information */}
        <div>
          <Label className="text-xl font-semibold text-orange-500 mb-4 block">
            Financial Information
          </Label>
          <dl className="space-y-0">
            <InfoRow label="GST Number" value={vendor.gst_number} />
            <InfoRow label="PAN Number" value={vendor.pan_number} />
            <InfoRow label="Bank Account" value={vendor.bank_account_number} />
            <InfoRow label="IFSC Code" value={vendor.ifsc_code} />
            <InfoRow
              label="Payment Terms"
              value={vendor.payment_terms.replace("_", " ").toUpperCase()}
            />
            <InfoRow
              label="Payment Methods"
              value={vendor.payment_methods.toUpperCase()}
            />
            <InfoRow label="TDS Rate" value={`${vendor.tds_rate}%`} />
            <InfoRow
              label="Billing Cycle"
              value={
                vendor.billing_cycle.charAt(0).toUpperCase() +
                vendor.billing_cycle.slice(1)
              }
            />
          </dl>
        </div>

        <hr className="border-gray-200" />

        {/* Status & Verification */}
        <div>
          <Label className="text-xl font-semibold text-orange-500 mb-4 block">
            Status & Verification
          </Label>
          <dl className="space-y-0">
            <InfoRow
              label="Brand Status"
              value={
                <Badge
                  label={vendor.vendor_status.toUpperCase()}
                  variant={getStatusBadge(vendor.vendor_status, "status")}
                />
              }
            />
            <InfoRow
              label="Verification Status"
              value={
                <Badge
                  label={vendor.verification_status.toUpperCase()}
                  variant={getStatusBadge(
                    vendor.verification_status,
                    "verification"
                  )}
                />
              }
            />
            <InfoRow
              label="Brand Status Cycle"
              value={vendor.vendor_status_cycle.toUpperCase()}
            />
            {vendor.verified_by && (
              <>
                <InfoRow label="Verified By" value={vendor.verified_by.name} />
                <InfoRow
                  label="Verified By Email"
                  value={vendor.verified_by.email}
                />
              </>
            )}
          </dl>
        </div>

        <hr className="border-gray-200" />

        {/* Risk & Contract */}
        <div>
          <Label className="text-xl font-semibold text-orange-500 mb-4 flex items-center gap-2">
            <AlertTriangle size={24} />
            Risk Assessment & Contract
          </Label>
          <dl className="space-y-0">
            <InfoRow
              label="Risk Rating"
              value={
                <Badge
                  label={vendor.risk_rating.toUpperCase()}
                  variant={getStatusBadge(vendor.risk_rating, "risk")}
                />
              }
            />
            <InfoRow label="Risk Notes" value={vendor.risk_notes} />
            <InfoRow label="Contract Terms" value={vendor.contract_terms} />
            <InfoRow
              label="Contract Expiry Date"
              value={new Date(vendor.contract_expiry_date).toLocaleDateString()}
            />
            <InfoRow
              label="Contract Renewal Date"
              value={new Date(
                vendor.contract_renewal_date
              ).toLocaleDateString()}
            />
          </dl>
        </div>

        <hr className="border-gray-200" />

        {/* Documents */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label className="text-xl font-semibold text-orange-500">
              Documents ({documents.length})
            </Label>
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 rounded-lg"
            >
              <Upload size={18} />
              Upload Document
            </Button>
          </div>
          {documents.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {doc.document_name}
                    </p>
                    <Trash2
                      size={16}
                      className="text-red-600 cursor-pointer hover:text-red-700 shrink-0"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          documentId: doc._id,
                          documentName: doc.document_name,
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    Type: {doc.document_type.replace("_", " ").toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Size: {(doc.file_size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                  {doc.expiry_date && (
                    <p className="text-xs text-gray-500 mb-2">
                      Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                    </p>
                  )}
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 text-sm inline-flex items-center gap-1 hover:underline"
                  >
                    <Download size={14} />
                    View/Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No documents uploaded</p>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Internal Notes */}
        {vendor.internal_notes && (
          <div>
            <Label className="text-xl font-semibold text-orange-500 mb-4 block">
              Internal Notes
            </Label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {vendor.internal_notes}
              </p>
            </div>
          </div>
        )}

        {/* Meta Information */}
        <div>
          <Label className="text-xl font-semibold text-orange-500 mb-4 block">
            Meta Information
          </Label>
          <dl className="space-y-0">
            <InfoRow label="Created By" value={vendor.createdBy.name} />
            <InfoRow label="Created By Email" value={vendor.createdBy.email} />
            <InfoRow
              label="Created At"
              value={new Date(vendor.createdAt).toLocaleString()}
            />
            <InfoRow
              label="Last Updated"
              value={new Date(vendor.updatedAt).toLocaleString()}
            />
          </dl>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="primary"
            onClick={() =>
              router.push(`/vendor/vendor-management/edit/${vendor._id}`)
            }
            className="px-8 rounded-lg flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Brand
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="px-8 rounded-lg"
          >
            Back to List
          </Button>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Update Verification Status
            </h2>

            <div className="space-y-4">
              <Select
                label="Verification Status *"
                options={verificationStatusOptions}
                value={verificationStatus}
                onChange={setVerificationStatus}
                placeholder="Select status"
                selectClassName="py-3 px-4"
              />

              <Textarea
                label="Notes"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Enter verification notes..."
                rows={4}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                onClick={handleVerify}
                disabled={verifying}
                className="flex-1 rounded-lg"
              >
                {verifying ? "Updating..." : "Update Status"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationStatus("");
                  setVerificationNotes("");
                }}
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Upload Document
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>

              <Select
                label="Document Type *"
                options={documentTypes}
                value={uploadType}
                onChange={setUploadType}
                placeholder="Select type"
                selectClassName="py-3 px-4"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={uploadExpiry}
                  onChange={(e) => setUploadExpiry(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                onClick={handleUploadDocument}
                disabled={uploading}
                className="flex-1 rounded-lg"
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadType("");
                  setUploadExpiry("");
                }}
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Document Confirmation */}
      {deleteDialog.open && (
        <ConfirmDialog
          title="Delete Document"
          message={`Are you sure you want to delete "${deleteDialog.documentName}"? This action cannot be undone.`}
          onConfirm={handleDeleteDocument}
          onCancel={() =>
            setDeleteDialog({ open: false, documentId: "", documentName: "" })
          }
          isOpen={false}
        />
      )}
    </div>
  );
}
