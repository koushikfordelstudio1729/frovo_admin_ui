"use client";

import { useState } from "react";
import {
  PERMISSION_GROUPS,
  PERMISSION_GROUP_LABELS,
  PermissionGroupKey,
  PermissionsState,
} from "@/types/permissions.types";
import { DEFAULT_PERMISSIONS, PERMISSION_GROUP_KEYS } from "@/utils/constants";
import { Checkbox } from "@/components";

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
              <Checkbox
                key={permission.key}
                label={permission.key}
                checked={permission.checked}
                onChange={() => togglePermission(selectedGroup, permission.key)}
                className="text-xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagement;
