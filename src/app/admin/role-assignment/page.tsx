"use client";

import { useState } from "react";
import { SCOPE_OPTIONS } from "@/config/scoped-roles.config";
import { ScopeType } from "@/types/scoped-roles.types";
import { ChevronDown } from "lucide-react";

export default function ScopedRoleAssignmentPage() {
  const [selectedScope, setSelectedScope] = useState<ScopeType>("Global");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-4">
        Select scope level
      </h1>

      {/* Scope Dropdown */}
      <div className="mb-8 w-full relative bg-gray-100">
        <select
          value={selectedScope}
          onChange={(e) => {
            setSelectedScope(e.target.value as ScopeType);
          }}
          className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none appearance-none pr-12"
        >
          {SCOPE_OPTIONS.map((scope) => (
            <option key={scope} value={scope}>
              {scope}
            </option>
          ))}
        </select>

        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
          size={28}
        />
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Machines / Partners */}
        <div className="col-span-1 bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Machines / Partners
          </h2>

          {/* Blank Map Container */}
          <div className="w-xl h-96 bg-gray-200 rounded-xl "></div>
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
        <button className="px-8 py-3 text-xl  bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
          Save Role Scope
        </button>
      </div>
    </div>
  );
}
