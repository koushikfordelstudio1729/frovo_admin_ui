"use client";

import { useState } from "react";
import {
  PERMISSION_GROUPS,
  PERMISSION_GROUP_LABELS,
  PermissionGroupKey,
  PermissionsState,
} from "@/types/permissions.types";
import { DEFAULT_PERMISSIONS, PERMISSION_GROUP_KEYS } from "@/utils/constants";

const PermissionsManagement = () => {
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroupKey>(
    PERMISSION_GROUPS.MACHINE
  );
  const [permissions, setPermissions] =
    useState<PermissionsState>(DEFAULT_PERMISSIONS);

  const togglePermission = (group: PermissionGroupKey, permKey: string) => {
    setPermissions((prev) => ({
      ...prev,
      [group]: prev[group].map((p) =>
        p.key === permKey ? { ...p, checked: !p.checked } : p
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Permission Groups */}
        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <div className="space-y-1">
            {PERMISSION_GROUP_KEYS.map((groupKey, index) => {
              const label = PERMISSION_GROUP_LABELS[groupKey];
              return (
                <div
                  key={groupKey}
                  onClick={() => setSelectedGroup(groupKey)}
                  className={`px-6 py-4 text-xl font-semibold cursor-pointer transition-colors ${
                    selectedGroup === groupKey
                      ? "text-gray-900"
                      : "text-gray-400"
                  } ${
                    index !== PERMISSION_GROUP_KEYS.length - 1
                      ? "border-b border-gray-300"
                      : ""
                  }`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Permission Keys */}
        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Permission Keys
          </h2>
          <div className="space-y-4">
            {permissions[selectedGroup]?.map((permission) => (
              <label
                key={permission.key}
                className="flex items-center gap-4 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={permission.checked}
                    onChange={() =>
                      togglePermission(selectedGroup, permission.key)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                    {permission.checked && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-lg text-gray-900">{permission.key}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagement;
