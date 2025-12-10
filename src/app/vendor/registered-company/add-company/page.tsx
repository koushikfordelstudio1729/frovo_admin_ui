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

const TODAY = new Date().toISOString().split("T")[0];

const legalEntityOptions = [
  { label: "Pvt Ltd", value: "Private Limited Company" },
  { label: "LLP", value: "LLP" },
  { label: "Public Ltd", value: "Public Limited Company" },
  { label: "Partnership", value: "Partnership" },
  { label: "Sole Proprietor", value: "Proprietor" },
];

const REGEX = {
  CIN: /^[A-Z]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
  DIN: /^\d{8}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  WEBSITE: /^https?:\/\/[a-zA-Z0-9.-]+\.[a-z]{2,}/,
};

type CompanyForm = {
  legalEntity: string;
  companyName: string;
  cin: string;
  dateIncorporation: string;
  officeAddress: string;
  website: string;
  email: string;
  directorName: string;
  din: string;
};

export default function AddCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CompanyForm>({
    legalEntity: "",
    companyName: "",
    cin: "",
    dateIncorporation: "",
    officeAddress: "",
    website: "",
    email: "",
    directorName: "",
    din: "",
  });

  const handleChange = (field: keyof CompanyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.companyName || !form.legalEntity || !form.cin)
      return "Please fill all required fields";

    if (new Date(form.dateIncorporation) > new Date())
      return "Date of incorporation cannot be in the future";

    if (!REGEX.CIN.test(form.cin.trim())) return "Invalid CIN format";

    if (form.din && !REGEX.DIN.test(form.din.trim()))
      return "DIN must be exactly 8 digits";

    if (form.email && !REGEX.EMAIL.test(form.email.trim()))
      return "Invalid email format";

    if (form.website && !REGEX.WEBSITE.test(form.website.trim()))
      return "Invalid website URL. Use https://example.com";

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const payload = {
        registered_company_name: form.companyName.trim(),
        company_address: form.officeAddress.trim(),
        office_email: form.email.trim(),
        legal_entity_structure: form.legalEntity,
        company_registration_number: form.cin.trim(),
        date_of_incorporation: form.dateIncorporation,
        corporate_website: form.website.trim(),
        directory_signature_name: form.directorName.trim(),
        din: form.din.trim(),
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
      console.log("Company Registration Error →", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title="Add Company" />

      <div className="bg-white rounded-xl p-8 space-y-10 shadow-md">
        {/* Company Identity */}
        <Label className="text-2xl font-semibold text-orange-500">
          Company Identity
        </Label>

        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Legal Entity Structure*"
            options={legalEntityOptions}
            value={form.legalEntity}
            variant="orange"
            onChange={(val) => handleChange("legalEntity", val)}
            placeholder="Select Entity Type"
          />

          <Input
            label="Registered Company Name*"
            value={form.companyName}
            variant="orange"
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Enter Registered Name"
          />

          <Input
            label="CIN / Registration No*"
            value={form.cin}
            variant="orange"
            onChange={(e) => handleChange("cin", e.target.value.toUpperCase())}
            placeholder="Enter CIN"
          />

          <Input
            label="Date of Incorporation*"
            type="date"
            value={form.dateIncorporation}
            max={TODAY}
            variant="orange"
            onChange={(e) => handleChange("dateIncorporation", e.target.value)}
          />
        </div>

        {/* Contact & Location */}
        <Label className="text-2xl font-semibold text-orange-500">
          Contact & Location
        </Label>

        <div className="grid grid-cols-2 gap-6">
          <Textarea
            label="Registered Office Address"
            variant="orange"
            value={form.officeAddress}
            onChange={(e) => handleChange("officeAddress", e.target.value)}
            rows={5}
          />

          <div className="flex flex-col gap-6">
            <Input
              label="Corporate Website"
              variant="orange"
              value={form.website}
              placeholder="https://company.com"
              onChange={(e) => handleChange("website", e.target.value)}
            />

            <Input
              label="Official Email"
              variant="orange"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>

        {/* Personnel */}
        <Label className="text-2xl font-semibold text-orange-500">
          Key Personnel
        </Label>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Director Name"
            variant="orange"
            value={form.directorName}
            onChange={(e) => handleChange("directorName", e.target.value)}
          />

          <Input
            label="DIN"
            variant="orange"
            value={form.din}
            onChange={(e) => handleChange("din", e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-10">
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
