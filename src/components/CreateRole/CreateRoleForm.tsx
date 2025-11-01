"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CreateRoleForm: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
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
              <div>
                <label className="block text-xl font-medium text-gray-900 mb-2">
                  Role Type
                </label>
                <input
                  type="text"
                  className="w-full text-black px-4 py-4 border-2 bg-gray-100 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500"
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="w-130 text-black px-4 py-3 border-2 bg-gray-100 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500"
              />
            </div>
            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button className="px-8 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium">
                Publish
              </button>
              <button className="px-8 py-2 bg-gray-700 text-white rounded hover:bg-gray-700 font-medium">
                Save draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleForm;
