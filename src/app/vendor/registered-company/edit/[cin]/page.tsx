"use client";

import { useState, useEffect } from "react";
import {
  BackHeader,
  Button,
  Input,
  Label,
  Select,
  SuccessDialog,
  Textarea,
} from "@/components";
import { useRouter, useParams } from "next/navigation";
import { getCompanyByCIN, updateCompany } from "@/services/vendor";
import { toast } from "react-hot-toast";
import {
  COMPANY_VALIDATION_PATTERNS,
  validateCompanyField,
  UpdateCompanyPayload,
  VendorCompany,
} from "@/types/vendor.types";

const TODAY = new Date().toISOString().split("T")[0];

const companyStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

type EditableFields = {
  officeAddress: string;
  website: string;
  email: string;
  directorName: string;
  gstNumber: string;
  companyStatus: string;
  riskRating: string;
};

type ValidationErrors = {
  [K in keyof EditableFields]?: string;
};

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const cin = params.cin as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [companyData, setCompanyData] = useState<VendorCompany | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState<EditableFields>({
    officeAddress: "",
    website: "",
    email: "",
    directorName: "",
    gstNumber: "",
    companyStatus: "active",
    riskRating: "medium",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await getCompanyByCIN(cin);
        const company = res.data.data;

        setCompanyData(company);
        setForm({
          officeAddress: company.company_address || "",
          website: company.corporate_website || "",
          email: company.office_email || "",
          directorName: company.directory_signature_name || "",
          gstNumber: company.gst_number || "",
          companyStatus: company.company_status,
          riskRating: company.risk_rating,
        });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load company");
        router.push("/vendor/registered-company");
      } finally {
        setLoading(false);
      }
    };

    if (cin) {
      fetchCompany();
    }
  }, [cin, router]);

  const handleChange = (field: keyof EditableFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof typeof COMPANY_VALIDATION_PATTERNS) => {
    const value = form[field as keyof EditableFields];
    if (!value) return;

    const validation = validateCompanyField(field, value);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [field]: validation.error }));
    }
  };

  const validate = (): string | null => {
    const newErrors: ValidationErrors = {};

    // Required fields
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.officeAddress.trim())
      newErrors.officeAddress = "Office address is required";
    if (!form.website.trim())
      newErrors.website = "Corporate website is required";
    if (!form.directorName.trim())
      newErrors.directorName = "Director name is required";

    // Format validations
    if (form.gstNumber.trim()) {
      const gstValidation = validateCompanyField("GST", form.gstNumber.trim());
      if (!gstValidation.isValid) newErrors.gstNumber = gstValidation.error;
    }

    if (form.email.trim()) {
      const emailValidation = validateCompanyField("EMAIL", form.email.trim());
      if (!emailValidation.isValid) newErrors.email = emailValidation.error;
    }

    if (form.website.trim()) {
      const websiteValidation = validateCompanyField(
        "WEBSITE",
        form.website.trim()
      );
      if (!websiteValidation.isValid)
        newErrors.website = websiteValidation.error;
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
      setSubmitting(true);

      const payload: UpdateCompanyPayload = {
        company_address: form.officeAddress.trim(),
        office_email: form.email.trim(),
        corporate_website: form.website.trim(),
        directory_signature_name: form.directorName.trim(),
        gst_number: form.gstNumber.trim() || undefined,
        company_status: form.companyStatus as any,
        risk_rating: form.riskRating as any,
      };

      await updateCompany(cin, payload);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/vendor/registered-company");
      }, 2000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to update company";
      toast.error(msg);
      console.error("Company Update Error →", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading company details...
        </p>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Company not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title="Edit Company" />

      <div className="bg-white rounded-xl p-8 space-y-10">
        {/* Company Identity - Read Only */}
        <div>
          <Label className="text-2xl font-semibold text-orange-500">
            Company Identity (Read Only)
          </Label>
          <div className="grid grid-cols-2 mt-6 gap-6 bg-gray-50 p-6 rounded-lg">
            <div>
              <Label className="text-sm text-gray-600">Company Name</Label>
              <p className="text-lg font-medium mt-1 text-gray-900">
                {companyData.registered_company_name}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">
                Legal Entity Structure
              </Label>
              <p className="text-lg font-medium mt-1 text-gray-900">
                {companyData.legal_entity_structure}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">CIN</Label>
              <p className="text-lg font-medium mt-1 text-gray-900">
                {companyData.cin}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">
                Date of Incorporation
              </Label>
              <p className="text-lg font-medium mt-1 text-gray-900">
                {new Date(
                  companyData.date_of_incorporation
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">DIN</Label>
              <p className="text-lg font-medium mt-1 text-gray-900">
                {companyData.din}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-2 border-gray-200" />

        {/* Editable Fields */}
        <Label className="text-2xl font-semibold text-orange-500">
          Editable Information
        </Label>

        {/* Contact & Location */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Textarea
              label="Registered Office Address *"
              variant="orange"
              placeholder="Enter complete office address with city, state, and pincode"
              value={form.officeAddress}
              onChange={(e) => handleChange("officeAddress", e.target.value)}
              rows={6}
            />
            {errors.officeAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.officeAddress}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <Input
                label="Corporate Website *"
                variant="orange"
                value={form.website}
                placeholder="e.g., https://www.company.com"
                onChange={(e) => handleChange("website", e.target.value)}
                onBlur={() => handleBlur("WEBSITE")}
              />
              {errors.website ? (
                <p className="text-red-500 text-sm mt-1">{errors.website}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  Format: {COMPANY_VALIDATION_PATTERNS.WEBSITE.example}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Official Email (Corporate) *"
                variant="orange"
                placeholder="e.g., contact@company.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("EMAIL")}
              />
              {errors.email ? (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  Format: {COMPANY_VALIDATION_PATTERNS.EMAIL.example}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Director & Additional Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Input
              label="Director / Auth. Signatory Name *"
              variant="orange"
              placeholder="Enter director name"
              value={form.directorName}
              onChange={(e) => handleChange("directorName", e.target.value)}
            />
            {errors.directorName && (
              <p className="text-red-500 text-sm mt-1">{errors.directorName}</p>
            )}
          </div>

          <div>
            <Input
              label="GST Number"
              value={form.gstNumber}
              variant="orange"
              onChange={(e) =>
                handleChange("gstNumber", e.target.value.toUpperCase())
              }
              onBlur={() => handleBlur("GST")}
              placeholder="e.g., 07AABCP0634E1ZU"
            />
            {errors.gstNumber ? (
              <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Format: {COMPANY_VALIDATION_PATTERNS.GST.example}
              </p>
            )}
          </div>

          <div>
            <Select
              label="Company Status *"
              options={companyStatusOptions}
              value={form.companyStatus}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("companyStatus", val)}
            />
          </div>

          <div>
            <Select
              label="Risk Rating *"
              options={riskRatingOptions}
              value={form.riskRating}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("riskRating", val)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 rounded-lg"
          >
            {submitting ? "Updating..." : "Update Company"}
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
      <SuccessDialog
        open={showSuccess}
        title="Company updated"
        message="Company details have been updated successfully."
        primaryText="OK"
        onClose={() => {
          setShowSuccess(false);
          router.push("/vendor/registered-company");
        }}
      />
    </div>
  );
}
