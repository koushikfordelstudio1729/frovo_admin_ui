// src/components/CreateDepartmentForm.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input, Textarea, Select } from "@/components/common";

export const CreateDepartmentForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    role: "",
    users: "",
  });

  const roleOptions = [
    { value: "ops-manager", label: "Ops Manager" },
    { value: "technician", label: "Technician" },
    { value: "supervisor", label: "Supervisor" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-900 mt-8 hover:text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-semibold text-gray-900 pt-8">
          Create new department
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl p-8 pb-12">
        <form onSubmit={handleSubmit} className="w-full max-w-6xl space-y-6">
          {/* Department Name */}
          <Input
            label="Department Name"
            variant="orange"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter department name"
          />

          {/* Description */}
          <Textarea
            label="Description"
            variant="orange"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Enter description"
          />

          {/* Available Roles & Add Users */}
          <div className="grid grid-cols-2 gap-6">
            <Select
              label="Available roles"
              variant="orange"
              options={roleOptions}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              placeholder="Select role"
            />

            <Input
              label="Add users"
              variant="orange"
              value={formData.users}
              onChange={(e) =>
                setFormData({ ...formData, users: e.target.value })
              }
              placeholder="Enter user names"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button type="submit" variant="primary" size="md" className="px-12">
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="px-12"
            >
              Save draft
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateDepartmentForm;
