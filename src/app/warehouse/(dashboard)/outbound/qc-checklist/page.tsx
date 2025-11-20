"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Label, Select, Input, Button } from "@/components";

const categories = [
  { label: "Beverages", value: "beverages" },
  { label: "Snacks", value: "snacks" },
  { label: "Packaged Food", value: "packaged-food" },
];

interface Parameter {
  id: string;
  parameter: string;
  value: string;
}

export default function QCChecklistTemplatesPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [parameters, setParameters] = useState<Parameter[]>([
    { id: "1", parameter: "", value: "" },
  ]);

  const addParameter = () => {
    setParameters([
      ...parameters,
      { id: Date.now().toString(), parameter: "", value: "" },
    ]);
  };

  const removeParameter = (id: string) => {
    setParameters(parameters.filter((p) => p.id !== id));
  };

  const updateParameter = (
    id: string,
    field: "parameter" | "value",
    val: string
  ) => {
    setParameters(
      parameters.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSaveTemplate = () => {
    console.log({ title, category, parameters });
    alert("Template Saved!");
  };

  const handleApplyTemplate = () => {
    console.log({ title, category, parameters });
    alert("Template Applied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 my-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          QC Checklist Templates
        </h1>
      </div>

      {/* Form Card */}
      <div className="max-w-full bg-white rounded-2xl p-8">
        {/* Template Title */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Template Title
          </Label>
          <Input
            type="text"
            placeholder="Title"
            variant="default"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-700 mb-2 block">
            Category
          </Label>
          <Select
            id="category"
            value={category}
            options={categories}
            placeholder="Select Category"
            onChange={(val) => setCategory(val)}
            selectClassName="w-full bg-gray-100 px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Add Parameter Section */}
        <div className="mb-8">
          <Label className="text-lg font-semibold text-gray-700 mb-3 block">
            Add Parameter
          </Label>
          {parameters.map((param) => (
            <div key={param.id} className="grid grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                label="Add Parameter"
                variant="default"
                placeholder="Add Parameter"
                value={param.parameter}
                onChange={(e) =>
                  updateParameter(param.id, "parameter", e.target.value)
                }
              />
              <Input
                type="text"
                label="Add Value"
                placeholder="Add Value"
                variant="default"
                value={param.value}
                onChange={(e) =>
                  updateParameter(param.id, "value", e.target.value)
                }
              />
            </div>
          ))}
          <div className="flex gap-3 mt-4">
            <Button
              className="rounded-lg"
              variant="primary"
              size="md"
              onClick={addParameter}
            >
              Add More
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                parameters.length > 1 &&
                removeParameter(parameters[parameters.length - 1].id)
              }
            >
              Remove
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            className="rounded-lg"
            variant="primary"
            size="lg"
            onClick={handleSaveTemplate}
          >
            Save template
          </Button>
          <Button
            className="rounded-lg"
            variant="secondary"
            size="lg"
            onClick={handleApplyTemplate}
          >
            Apply template
          </Button>
        </div>
      </div>
    </div>
  );
}
