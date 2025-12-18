"use client";

import { useState } from "react";
import {
  BackHeader,
  Button,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components";
import { useRouter } from "next/navigation";
import { createCompany } from "@/services/vendor";
import { toast } from "react-hot-toast";
import {
  COMPANY_VALIDATION_PATTERNS,
  validateCompanyField,
  CreateCompanyPayload,
} from "@/types/vendor.types";

const TODAY = new Date().toISOString().split("T")[0];

const legalEntityOptions = [
  { label: "Pvt Ltd", value: "Pvt Ltd" },
  { label: "Private Limited Company", value: "Private Limited Company" },
  { label: "LLP", value: "LLP" },
  { label: "Public Limited Company", value: "Public Limited Company" },
  { label: "Partnership", value: "Partnership" },
  { label: "Sole Proprietorship", value: "Sole Proprietorship" },
];

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

type CompanyForm = {
  legalEntity: string;
  companyName: string;
  cin: string;
  gstNumber: string;
  dateIncorporation: string;
  officeAddress: string;
  website: string;
  email: string;
  directorName: string;
  din: string;
  companyStatus: string;
  riskRating: string;
};

type ValidationErrors = {
  [K in keyof CompanyForm]?: string;
};

export default function AddCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [form, setForm] = useState<CompanyForm>({
    legalEntity: "",
    companyName: "",
    cin: "",
    gstNumber: "",
    dateIncorporation: "",
    officeAddress: "",
    website: "",
    email: "",
    directorName: "",
    din: "",
    companyStatus: "active",
    riskRating: "medium",
  });

  const handleChange = (field: keyof CompanyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof typeof COMPANY_VALIDATION_PATTERNS) => {
    const value = form[field as keyof CompanyForm];
    if (!value) return;

    const validation = validateCompanyField(field, value);
    if (!validation.isValid) {
      setErrors((prev) => ({ ...prev, [field]: validation.error }));
    }
  };

  const validate = (): string | null => {
    const newErrors: ValidationErrors = {};

    // Required fields
    if (!form.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!form.legalEntity) newErrors.legalEntity = "Legal entity structure is required";
    if (!form.cin.trim()) newErrors.cin = "CIN is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.officeAddress.trim()) newErrors.officeAddress = "Office address is required";
    if (!form.website.trim()) newErrors.website = "Corporate website is required";
    if (!form.directorName.trim()) newErrors.directorName = "Director name is required";
    if (!form.din.trim()) newErrors.din = "DIN is required";
    if (!form.dateIncorporation) newErrors.dateIncorporation = "Date of incorporation is required";

    // Date validation
    if (form.dateIncorporation && new Date(form.dateIncorporation) > new Date()) {
      newErrors.dateIncorporation = "Date of incorporation cannot be in the future";
    }

    // Format validations
    if (form.cin.trim()) {
      const cinValidation = validateCompanyField("CIN", form.cin.trim());
      if (!cinValidation.isValid) newErrors.cin = cinValidation.error;
    }

    if (form.gstNumber.trim()) {
      const gstValidation = validateCompanyField("GST", form.gstNumber.trim());
      if (!gstValidation.isValid) newErrors.gstNumber = gstValidation.error;
    }

    if (form.din.trim()) {
      const dinValidation = validateCompanyField("DIN", form.din.trim());
      if (!dinValidation.isValid) newErrors.din = dinValidation.error;
    }

    if (form.email.trim()) {
      const emailValidation = validateCompanyField("EMAIL", form.email.trim());
      if (!emailValidation.isValid) newErrors.email = emailValidation.error;
    }

    if (form.website.trim()) {
      const websiteValidation = validateCompanyField("WEBSITE", form.website.trim());
      if (!websiteValidation.isValid) newErrors.website = websiteValidation.error;
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

      const payload: CreateCompanyPayload = {
        registered_company_name: form.companyName.trim(),
        company_address: form.officeAddress.trim(),
        office_email: form.email.trim(),
        legal_entity_structure: form.legalEntity as any,
        cin: form.cin.trim(),
        gst_number: form.gstNumber.trim() || undefined,
        date_of_incorporation: form.dateIncorporation,
        corporate_website: form.website.trim(),
        directory_signature_name: form.directorName.trim(),
        din: form.din.trim(),
        company_status: form.companyStatus as any,
        risk_rating: form.riskRating as any,
      };

      await createCompany(payload);

      toast.success("Company registered successfully!");
      router.push("/vendor/registered-company");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to register company";
      toast.error(msg);
      console.error("Company Registration Error →", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title="Add Company" />

      <div className="bg-white rounded-xl p-8 space-y-10">
        {/* Company Identity */}
        <Label className="text-2xl font-semibold text-orange-500">
          Company Identity
        </Label>

        <div className="grid grid-cols-2 mt-8 gap-6">
          <div>
            <Select
              label="Legal Entity Structure *"
              options={legalEntityOptions}
              value={form.legalEntity}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("legalEntity", val)}
              placeholder="Select Entity Type"
            />
            {errors.legalEntity && (
              <p className="text-red-500 text-sm mt-1">{errors.legalEntity}</p>
            )}
          </div>

          <div>
            <Input
              label="Registered Company Name *"
              value={form.companyName}
              variant="orange"
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Enter Registered Name"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <Input
              label="Corporate Identification Number (CIN) *"
              value={form.cin}
              variant="orange"
              onChange={(e) => handleChange("cin", e.target.value.toUpperCase())}
              onBlur={() => handleBlur("CIN")}
              placeholder="e.g., U15499DL1989PTC035955"
            />
            {errors.cin ? (
              <p className="text-red-500 text-sm mt-1">{errors.cin}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Format: {COMPANY_VALIDATION_PATTERNS.CIN.example}
              </p>
            )}
          </div>

          <div>
            <Input
              label="GST Number"
              value={form.gstNumber}
              variant="orange"
              onChange={(e) => handleChange("gstNumber", e.target.value.toUpperCase())}
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
            <Input
              label="Date of Incorporation *"
              type="date"
              value={form.dateIncorporation}
              max={TODAY}
              variant="orange"
              onChange={(e) => handleChange("dateIncorporation", e.target.value)}
            />
            {errors.dateIncorporation && (
              <p className="text-red-500 text-sm mt-1">{errors.dateIncorporation}</p>
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

        <hr className="border-2 border-gray-200" />

        {/* Contact & Location */}
        <Label className="text-2xl font-semibold  text-orange-500">
          Contact & Location
        </Label>

        <div className="grid grid-cols-2 mt-8 gap-6">
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
              <p className="text-red-500 text-sm mt-1">{errors.officeAddress}</p>
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

        <hr className="border-2 border-gray-200" />

        {/* Personnel */}
        <Label className="text-2xl font-semibold text-orange-500">
          Key Personnel
        </Label>

        <div className="grid grid-cols-2 mt-8 gap-6">
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
              label="Director Identification No. (DIN) *"
              variant="orange"
              placeholder="e.g., 08845260"
              value={form.din}
              onChange={(e) => handleChange("din", e.target.value)}
              onBlur={() => handleBlur("DIN")}
            />
            {errors.din ? (
              <p className="text-red-500 text-sm mt-1">{errors.din}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Format: {COMPANY_VALIDATION_PATTERNS.DIN.example} (8 digits)
              </p>
            )}
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
            {loading ? "Submitting..." : "Submit"}
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
