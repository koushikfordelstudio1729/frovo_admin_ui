"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../common";

const CreateRoleForm: React.FC = () => {
  const router = useRouter();
  const [roleType, setRoleType] = useState("");
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 mt-4">
        <button onClick={() => router.back()} className="text-gray-900 mt-8 ">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-semibold text-gray-900 pt-8">
          Create new role
        </h1>
      </div>
      {/* Form Container */}
      <div className="bg-white rounded-xl p-8 pb-28">
        <div className="flex items-center justify-center">
          <h1 className="text-4xl text-gray-900 font-bold">Basic Info</h1>
        </div>
        {/* Form Container */}
        <div className="flex justify-items-start">
          <div className="w-full max-w-6xl space-y-6 ">
            <div className="grid grid-cols-2 gap-30 mt-8">
              <div>
                <label className="block text-xl font-medium text-gray-900 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full text-black px-4 py-4 border-2 bg-gray-100 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500"
                />
              </div>
              <div className="relative">
                <label className="block text-xl font-medium text-gray-900 mb-2">
                  Role Type
                </label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-full text-black px-4 py-4 border-2 bg-gray-100 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-10"
                >
                  <option value="" disabled>
                    Select Role Type
                  </option>
                  <option value="system">System</option>
                  <option value="custom">Custom</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-[58px] pointer-events-none text-gray-600"
                  size={20}
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block text-xl font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="w-130 text-black px-4 py-3 border-2 bg-gray-100 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="primary" size="md" className="px-12">
                Publish
              </Button>
              <Button variant="secondary" size="md" className="px-12">
                Save draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleForm;
