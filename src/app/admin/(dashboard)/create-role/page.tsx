"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input, Textarea, Select } from "@/components/common";

const CreateRoleForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roleName: "",
    roleType: "",
    description: "",
  });

  const roleTypeOptions = [
    { value: "system", label: "System" },
    { value: "custom", label: "Custom" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", formData);
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-900 mt-8 hover:text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-semibold text-gray-900 pt-8">
          Create new role
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl p-8 pb-28">
        {/* Title */}
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-4xl text-gray-900 font-bold">Basic Info</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-6xl space-y-6">
          {/* Role Name & Role Type */}
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Role Name"
              variant="orange"
              value={formData.roleName}
              onChange={(e) =>
                setFormData({ ...formData, roleName: e.target.value })
              }
              placeholder="Enter role name"
            />

            <Select
              label="Role Type"
              variant="orange"
              selectClassName="px-6 py-4 border-2 bg-white text-base"
              options={roleTypeOptions}
              value={formData.roleType}
              onChange={(val) => setFormData({ ...formData, roleType: val })}
              placeholder="Select Role Type"
            />
          </div>

          {/* Description */}
          <Textarea
            label="Description"
            variant="orange"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Enter role description"
          />

          {/* Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="px-12 rounded-lg"
            >
              Publish
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="px-12 rounded-lg"
              onClick={handleSaveDraft}
            >
              Save draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoleForm;
