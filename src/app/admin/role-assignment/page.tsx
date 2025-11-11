"use client";

import { useState } from "react";
import { SCOPE_OPTIONS } from "@/config/scoped-roles.config";
import { ScopeType } from "@/types/scoped-roles.types";
import { Button, Select } from "@/components/common";

export default function ScopedRoleAssignmentPage() {
  const [selectedScope, setSelectedScope] = useState<ScopeType>("Global");

  // Convert SCOPE_OPTIONS to Select format
  const scopeOptions = SCOPE_OPTIONS.map((scope) => ({
    value: scope,
    label: scope,
  }));

  const handleSave = () => {
    console.log("Saving role scope:", selectedScope);
    // TODO: Add API call
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-4">
        Select scope level
      </h1>

      {/* Scope Dropdown */}
      <div className="mb-8 w-full">
        <Select
          variant="default"
          options={scopeOptions}
          value={selectedScope}
          onChange={(e) => setSelectedScope(e.target.value as ScopeType)}
          selectClassName="bg-gray-100 py-3 text-base font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Machines / Partners */}
        <div className="col-span-1 bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Machines / Partners
          </h2>

          {/* Blank Map Container */}
          <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
            <p className="text-gray-500 text-sm">Map View</p>
          </div>
        </div>

        {/* Selected Entities */}
        <div className="bg-white rounded-lg p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Selected entities
          </h3>

          {/* Count */}
          <div className="bg-gray-100 rounded p-4">
            <p className="text-sm font-medium text-gray-700">
              Machines Selected
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          className="px-8 text-xl"
        >
          Save Role Scope
        </Button>
      </div>
    </div>
  );
}
