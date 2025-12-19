"use client";

import { useState, useEffect } from "react";
import {
  BackHeader,
  Button,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components";
import { useRouter, useParams } from "next/navigation";
import { getVendorById, updateVendor } from "@/services/vendor";
import { toast } from "react-hot-toast";
import {
  UpdateVendorPayload,
  Vendor,
  VENDOR_TYPE_OPTIONS,
  VENDOR_CATEGORY_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  PAYMENT_METHODS_OPTIONS,
  BILLING_CYCLE_OPTIONS,
  RISK_RATING_OPTIONS,
  VENDOR_STATUS_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  validateVendorField,
  VENDOR_VALIDATION_PATTERNS,
} from "@/types/vendor-data.types";

const TODAY = new Date().toISOString().split("T")[0];

type VendorForm = {
  vendor_name: string;
  vendor_billing_name: string;
  vendor_type: string[];
  vendor_category: string;
  material_categories_supplied: string;
  primary_contact_name: string;
  contact_phone: string;
  vendor_email: string;
  vendor_address: string;
  bank_account_number: string;
  ifsc_code: string;
  payment_terms: string;
  payment_methods: string;
  gst_number: string;
  pan_number: string;
  tds_rate: string;
  billing_cycle: string;
  vendor_status: string;
  verification_status: string;
  risk_rating: string;
  risk_notes: string;
  contract_terms: string;
  contract_expiry_date: string;
  contract_renewal_date: string;
  internal_notes: string;
};

type ValidationErrors = {
  [K in keyof VendorForm]?: string;
};

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [form, setForm] = useState<VendorForm>({
    vendor_name: "",
    vendor_billing_name: "",
    vendor_type: [],
    vendor_category: "",
    material_categories_supplied: "",
    primary_contact_name: "",
    contact_phone: "",
    vendor_email: "",
    vendor_address: "",
    bank_account_number: "",
    ifsc_code: "",
    payment_terms: "net_30",
    payment_methods: "neft",
    gst_number: "",
    pan_number: "",
    tds_rate: "1",
    billing_cycle: "monthly",
    vendor_status: "active",
    verification_status: "pending",
    risk_rating: "medium",
    risk_notes: "",
    contract_terms: "",
    contract_expiry_date: "",
    contract_renewal_date: "",
    internal_notes: "",
  });

  // Load vendor data
  useEffect(() => {
    const loadVendor = async () => {
      try {
        setLoadingData(true);
        const res = await getVendorById(vendorId);
        const vendorData = res.data.data;
        setVendor(vendorData);

        // Populate form
        setForm({
          vendor_name: vendorData.vendor_name,
          vendor_billing_name: vendorData.vendor_billing_name,
          vendor_type: vendorData.vendor_type,
          vendor_category: vendorData.vendor_category,
          material_categories_supplied:
            vendorData.material_categories_supplied?.join(", ") || "",
          primary_contact_name: vendorData.primary_contact_name,
          contact_phone: vendorData.contact_phone,
          vendor_email: vendorData.vendor_email,
          vendor_address: vendorData.vendor_address,
          bank_account_number: vendorData.bank_account_number,
          ifsc_code: vendorData.ifsc_code,
          payment_terms: vendorData.payment_terms,
          payment_methods: vendorData.payment_methods,
          gst_number: vendorData.gst_number,
          pan_number: vendorData.pan_number,
          tds_rate: vendorData.tds_rate.toString(),
          billing_cycle: vendorData.billing_cycle,
          vendor_status: vendorData.vendor_status,
          verification_status: vendorData.verification_status,
          risk_rating: vendorData.risk_rating,
          risk_notes: vendorData.risk_notes || "",
          contract_terms: vendorData.contract_terms || "",
          contract_expiry_date: vendorData.contract_expiry_date.split("T")[0],
          contract_renewal_date: vendorData.contract_renewal_date.split("T")[0],
          internal_notes: vendorData.internal_notes || "",
        });
      } catch (error: any) {
        toast.error("Failed to load vendor details");
        console.error(error);
        router.push("/vendor/vendor-management");
      } finally {
        setLoadingData(false);
      }
    };

    if (vendorId) {
      loadVendor();
    }
  }, [vendorId, router]);

  const handleChange = (field: keyof VendorForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof typeof VENDOR_VALIDATION_PATTERNS) => {
    const value = form[field as keyof VendorForm] as string;
    if (!value) return;

    const validation = validateVendorField(field, value);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [field]: validation.error }));
    }
  };

  const validate = (): string | null => {
    const newErrors: ValidationErrors = {};

    // Required fields
    if (!form.vendor_name.trim())
      newErrors.vendor_name = "Vendor name is required";
    if (!form.vendor_billing_name.trim())
      newErrors.vendor_billing_name = "Billing name is required";
    if (form.vendor_type.length === 0)
      newErrors.vendor_type = "At least one vendor type is required";
    if (!form.vendor_category)
      newErrors.vendor_category = "Vendor category is required";
    if (!form.primary_contact_name.trim())
      newErrors.primary_contact_name = "Contact name is required";
    if (!form.contact_phone.trim())
      newErrors.contact_phone = "Contact phone is required";
    if (!form.vendor_email.trim())
      newErrors.vendor_email = "Vendor email is required";
    if (!form.vendor_address.trim())
      newErrors.vendor_address = "Vendor address is required";

    // Field validations
    if (form.ifsc_code.trim()) {
      const validation = validateVendorField("IFSC", form.ifsc_code.trim());
      if (!validation.isValid) newErrors.ifsc_code = validation.error;
    }

    if (form.contact_phone.trim()) {
      const validation = validateVendorField("PHONE", form.contact_phone.trim());
      if (!validation.isValid) newErrors.contact_phone = validation.error;
    }

    if (form.pan_number.trim()) {
      const validation = validateVendorField("PAN", form.pan_number.trim());
      if (!validation.isValid) newErrors.pan_number = validation.error;
    }

    if (form.bank_account_number.trim()) {
      const validation = validateVendorField(
        "ACCOUNT_NUMBER",
        form.bank_account_number.trim()
      );
      if (!validation.isValid) newErrors.bank_account_number = validation.error;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return "Please fix the validation errors";
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const materialCategories = form.material_categories_supplied
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      const payload: UpdateVendorPayload = {
        vendor_name: form.vendor_name.trim(),
        vendor_billing_name: form.vendor_billing_name.trim(),
        vendor_type: form.vendor_type as any,
        vendor_category: form.vendor_category as any,
        material_categories_supplied: materialCategories,
        primary_contact_name: form.primary_contact_name.trim(),
        contact_phone: form.contact_phone.trim(),
        vendor_email: form.vendor_email.trim(),
        vendor_address: form.vendor_address.trim(),
        bank_account_number: form.bank_account_number.trim(),
        ifsc_code: form.ifsc_code.trim(),
        payment_terms: form.payment_terms as any,
        payment_methods: form.payment_methods as any,
        gst_number: form.gst_number.trim(),
        pan_number: form.pan_number.trim(),
        tds_rate: parseFloat(form.tds_rate),
        billing_cycle: form.billing_cycle as any,
        vendor_status: form.vendor_status as any,
        verification_status: form.verification_status as any,
        risk_rating: form.risk_rating as any,
        risk_notes: form.risk_notes.trim() || undefined,
        contract_terms: form.contract_terms.trim() || undefined,
        contract_expiry_date: form.contract_expiry_date,
        contract_renewal_date: form.contract_renewal_date,
        internal_notes: form.internal_notes.trim() || undefined,
      };

      await updateVendor(vendorId, payload);

      toast.success("Vendor updated successfully!");
      router.push("/vendor/vendor-management");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to update vendor";
      toast.error(msg);
      console.error("Vendor Update Error →", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading Vendor Details...
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Vendor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title={`Edit Vendor - ${vendor.vendor_id}`} />

      <div className="bg-white rounded-xl p-8 space-y-10">
        {/* Vendor Info Header */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Vendor ID:</strong> {vendor.vendor_id} | <strong>CIN:</strong>{" "}
            {vendor.cin}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Created: {new Date(vendor.createdAt).toLocaleDateString()} | Last
            Updated: {new Date(vendor.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Basic Information */}
        <Label className="text-2xl font-semibold text-orange-500">
          Basic Information
        </Label>

        <div className="grid grid-cols-2 mt-8 gap-6">
          <div>
            <Input
              label="Vendor Name *"
              value={form.vendor_name}
              variant="orange"
              onChange={(e) => handleChange("vendor_name", e.target.value)}
              placeholder="Enter vendor name"
            />
            {errors.vendor_name && (
              <p className="text-red-500 text-sm mt-1">{errors.vendor_name}</p>
            )}
          </div>

          <div>
            <Input
              label="Vendor Billing Name *"
              value={form.vendor_billing_name}
              variant="orange"
              onChange={(e) => handleChange("vendor_billing_name", e.target.value)}
              placeholder="Official billing name"
            />
            {errors.vendor_billing_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vendor_billing_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor Type(s) *
            </label>
            <select
              multiple
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={form.vendor_type}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                handleChange("vendor_type", selected);
              }}
            >
              {VENDOR_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-xs mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>
            {errors.vendor_type && (
              <p className="text-red-500 text-sm mt-1">{errors.vendor_type}</p>
            )}
          </div>

          <div>
            <Select
              label="Vendor Category *"
              options={VENDOR_CATEGORY_OPTIONS}
              value={form.vendor_category}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("vendor_category", val)}
              placeholder="Select category"
            />
            {errors.vendor_category && (
              <p className="text-red-500 text-sm mt-1">{errors.vendor_category}</p>
            )}
          </div>

          <div className="col-span-2">
            <Input
              label="Material Categories Supplied"
              value={form.material_categories_supplied}
              variant="orange"
              onChange={(e) =>
                handleChange("material_categories_supplied", e.target.value)
              }
              placeholder="Enter categories separated by commas"
            />
          </div>

          <div>
            <Select
              label="Vendor Status *"
              options={VENDOR_STATUS_OPTIONS}
              value={form.vendor_status}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("vendor_status", val)}
            />
          </div>

          <div>
            <Select
              label="Verification Status *"
              options={VERIFICATION_STATUS_OPTIONS}
              value={form.verification_status}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("verification_status", val)}
            />
          </div>
        </div>

        <hr className="border-2 border-gray-200" />

        {/* Contact Information */}
        <Label className="text-2xl font-semibold text-orange-500">
          Contact Information
        </Label>

        <div className="grid grid-cols-2 mt-8 gap-6">
          <div>
            <Input
              label="Primary Contact Name *"
              value={form.primary_contact_name}
              variant="orange"
              onChange={(e) => handleChange("primary_contact_name", e.target.value)}
              placeholder="Enter contact person name"
            />
            {errors.primary_contact_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.primary_contact_name}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Contact Phone *"
              value={form.contact_phone}
              variant="orange"
              onChange={(e) => handleChange("contact_phone", e.target.value)}
              onBlur={() => handleBlur("PHONE")}
              placeholder="+919876543210"
            />
            {errors.contact_phone ? (
              <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Format: {VENDOR_VALIDATION_PATTERNS.PHONE.example}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Vendor Email *"
              value={form.vendor_email}
              variant="orange"
              onChange={(e) => handleChange("vendor_email", e.target.value)}
              placeholder="vendor@example.com"
            />
            {errors.vendor_email && (
              <p className="text-red-500 text-sm mt-1">{errors.vendor_email}</p>
            )}
          </div>

          <div>
            <Textarea
              label="Vendor Address *"
              variant="orange"
              placeholder="Enter complete address"
              value={form.vendor_address}
              onChange={(e) => handleChange("vendor_address", e.target.value)}
              rows={3}
            />
            {errors.vendor_address && (
              <p className="text-red-500 text-sm mt-1">{errors.vendor_address}</p>
            )}
          </div>
        </div>

        <hr className="border-2 border-gray-200" />

        {/* Financial Information */}
        <Label className="text-2xl font-semibold text-orange-500">
          Financial Information
        </Label>

        <div className="grid grid-cols-2 mt-8 gap-6">
          <div>
            <Input
              label="Bank Account Number *"
              value={form.bank_account_number}
              variant="orange"
              onChange={(e) => handleChange("bank_account_number", e.target.value)}
              onBlur={() => handleBlur("ACCOUNT_NUMBER")}
              placeholder="1234567890123456"
            />
            {errors.bank_account_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bank_account_number}
              </p>
            )}
          </div>

          <div>
            <Input
              label="IFSC Code *"
              value={form.ifsc_code}
              variant="orange"
              onChange={(e) =>
                handleChange("ifsc_code", e.target.value.toUpperCase())
              }
              onBlur={() => handleBlur("IFSC")}
              placeholder="HDFC0001234"
            />
            {errors.ifsc_code && (
              <p className="text-red-500 text-sm mt-1">{errors.ifsc_code}</p>
            )}
          </div>

          <div>
            <Select
              label="Payment Terms *"
              options={PAYMENT_TERMS_OPTIONS}
              value={form.payment_terms}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("payment_terms", val)}
            />
          </div>

          <div>
            <Select
              label="Payment Methods *"
              options={PAYMENT_METHODS_OPTIONS}
              value={form.payment_methods}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("payment_methods", val)}
            />
          </div>

          <div>
            <Input
              label="GST Number *"
              value={form.gst_number}
              variant="orange"
              onChange={(e) =>
                handleChange("gst_number", e.target.value.toUpperCase())
              }
              placeholder="07AABCP0634E1ZU"
            />
            {errors.gst_number && (
              <p className="text-red-500 text-sm mt-1">{errors.gst_number}</p>
            )}
          </div>

          <div>
            <Input
              label="PAN Number *"
              value={form.pan_number}
              variant="orange"
              onChange={(e) =>
                handleChange("pan_number", e.target.value.toUpperCase())
              }
              onBlur={() => handleBlur("PAN")}
              placeholder="AABCP0634E"
            />
            {errors.pan_number && (
              <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
            )}
          </div>

          <div>
            <Input
              label="TDS Rate (%)"
              type="number"
              value={form.tds_rate}
              variant="orange"
              onChange={(e) => handleChange("tds_rate", e.target.value)}
              placeholder="1.0"
              step="0.1"
              min="0"
              max="100"
            />
          </div>

          <div>
            <Select
              label="Billing Cycle *"
              options={BILLING_CYCLE_OPTIONS}
              value={form.billing_cycle}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("billing_cycle", val)}
            />
          </div>
        </div>

        <hr className="border-2 border-gray-200" />

        {/* Risk & Contract */}
        <Label className="text-2xl font-semibold text-orange-500">
          Risk Assessment & Contract
        </Label>

        <div className="grid grid-cols-2 mt-8 gap-6">
          <div>
            <Select
              label="Risk Rating *"
              options={RISK_RATING_OPTIONS}
              value={form.risk_rating}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("risk_rating", val)}
            />
          </div>

          <div>
            <Textarea
              label="Risk Notes"
              variant="orange"
              placeholder="Enter any risk-related notes"
              value={form.risk_notes}
              onChange={(e) => handleChange("risk_notes", e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Input
              label="Contract Expiry Date *"
              type="date"
              value={form.contract_expiry_date}
              variant="orange"
              onChange={(e) => handleChange("contract_expiry_date", e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Contract Renewal Date *"
              type="date"
              value={form.contract_renewal_date}
              variant="orange"
              onChange={(e) =>
                handleChange("contract_renewal_date", e.target.value)
              }
            />
          </div>

          <div className="col-span-2">
            <Textarea
              label="Contract Terms"
              variant="orange"
              placeholder="Enter contract terms and conditions"
              value={form.contract_terms}
              onChange={(e) => handleChange("contract_terms", e.target.value)}
              rows={4}
            />
          </div>

          <div className="col-span-2">
            <Textarea
              label="Internal Notes"
              variant="orange"
              placeholder="Enter any internal notes"
              value={form.internal_notes}
              onChange={(e) => handleChange("internal_notes", e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 rounded-lg"
          >
            {loading ? "Updating..." : "Update Vendor"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="px-8 rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
