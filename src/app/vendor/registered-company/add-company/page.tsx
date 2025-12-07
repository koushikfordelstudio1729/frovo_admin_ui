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
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const legalEntityOptions = [
  { label: "Pvt Ltd", value: "Pvt Ltd" },
  { label: "LLP", value: "LLP" },
  { label: "Public Ltd", value: "Public Ltd" },
  { label: "Partnership", value: "Partnership" },
  { label: "Sole Proprietor", value: "Proprietor" },
];

export default function AddCompanyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
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

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Company Data Submitted:", form);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <BackHeader title="Add Company" />

      <div className="bg-white rounded-xl p-8 space-y-10">
        {/* Company Identity */}
        <div>
          <Label className="text-2xl font-semibold text-orange-500">
            Company Identity
          </Label>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <Select
              label="Legal Entity Structure"
              options={legalEntityOptions}
              value={form.legalEntity}
              variant="orange"
              selectClassName="py-4 px-4"
              onChange={(val) => handleChange("legalEntity", val)}
              placeholder="Select Entity Type"
            />

            <Input
              label="Registered Company Name"
              variant="orange"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Enter Registered Name"
            />

            <Input
              label="Corporate Identification Number (CIN)"
              variant="orange"
              value={form.cin}
              onChange={(e) => handleChange("cin", e.target.value)}
              placeholder="Enter CIN Number"
            />

            <Input
              label="Date of Incorporation"
              variant="orange"
              value={form.dateIncorporation}
              type="date"
              onChange={(e) =>
                handleChange("dateIncorporation", e.target.value)
              }
            />
          </div>
        </div>

        <hr className="border-2 text-gray-200" />

        {/* Contact & Location */}
        <div>
          <Label className="text-2xl font-semibold text-orange-500">
            Contact & Location
          </Label>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <Textarea
                label="Registered Office Address"
                variant="orange"
                value={form.officeAddress}
                onChange={(e) => handleChange("officeAddress", e.target.value)}
                placeholder="Enter Office Address"
                rows={6}
              />
            </div>
            <div className="flex flex-col gap-6">
              <Input
                label="Corporate Website"
                variant="orange"
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://company.com"
              />

              <Input
                label="Official Email (Corporate)"
                variant="orange"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
          </div>
        </div>

        <hr className="border-2 text-gray-200" />

        {/* Key Personnel */}
        <div>
          <Label className="text-2xl font-semibold text-orange-500">
            Key Personnel
          </Label>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <Input
              label="Director / Auth. Signatory Name"
              variant="orange"
              value={form.directorName}
              onChange={(e) => handleChange("directorName", e.target.value)}
              placeholder="Enter Director Name"
            />

            <Input
              label="Director Identification No. (DIN)"
              variant="orange"
              value={form.din}
              onChange={(e) => handleChange("din", e.target.value)}
              placeholder="Enter DIN"
            />
          </div>
        </div>

        {/* Submit / Cancel */}
        <div className="flex justify-center gap-4 mt-10">
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="px-8 rounded-lg"
          >
            Submit
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
