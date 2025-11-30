"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button, Input, Textarea, Select } from "@/components/common";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";

interface Permission {
  _id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  systemName?: string;
}

interface RolePayload {
  name: string;
  description: string;
  type?: string;
  department?: string;
  permissions: string[];
  scope: {
    level: string;
    entities?: string[];
  };
  uiAccess: string;
}

const CreateRoleForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roleName: "",
    department: "",
    scopeLevel: "global", // Default to global
    description: "",
    uiAccess: "",
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const scopeLevelOptions = [
    { value: "global", label: "Global" },
  ];

  const uiAccessOptions = [
    { value: "Admin Panel", label: "Admin Panel" },
    { value: "Finance Dashboard", label: "Finance Dashboard" },
    { value: "Mobile App", label: "Mobile App" },
    { value: "Mobile & Web", label: "Mobile & Web" },
  ];

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: Permission[] | { permissions: { [group: string]: Array<{
          id: string;
          key: string;
          description: string;
          module: string;
          action: string;
        }> } };
      }>(apiConfig.endpoints.permissions.list);

      if (response.data.success) {
        // Handle both response formats
        if (Array.isArray(response.data.data)) {
          setPermissions(response.data.data);
        } else if (response.data.data && 'permissions' in response.data.data) {
          // Flatten grouped permissions into a single array
          const allPermissions: Permission[] = [];
          Object.values(response.data.data.permissions).forEach((groupPerms) => {
            groupPerms.forEach((perm) => {
              allPermissions.push({
                _id: perm.id,
                name: perm.key,
                description: perm.description,
                module: perm.module,
                action: perm.action,
              });
            });
          });
          setPermissions(allPermissions);
        }
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: Department[];
      }>(apiConfig.endpoints.departments);

      console.log("Departments API Response:", response.data);

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      // Set empty array on error so dropdown doesn't break
      setDepartments([]);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPermissions(),
        fetchDepartments(),
      ]);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchPermissions, fetchDepartments]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handlePermissionToggle = (permissionName: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionName)) {
        newSet.delete(permissionName);
      } else {
        newSet.add(permissionName);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roleName || !formData.scopeLevel || !formData.uiAccess) {
      setError("Please fill in all required fields");
      return;
    }

    if (selectedPermissions.size === 0) {
      setError("Please select at least one permission");
      return;
    }

    const payload: RolePayload = {
      name: formData.roleName,
      description: formData.description,
      permissions: Array.from(selectedPermissions),
      scope: {
        level: formData.scopeLevel,
      },
      uiAccess: formData.uiAccess,
      ...(formData.department && { department: formData.department }),
    };

    try {
      setSubmitting(true);
      setError(null);
      const response = await api.post(apiConfig.endpoints.roles, payload);

      if (response.data.success) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          roleName: "",
          department: "",
          scopeLevel: "global",
          description: "",
          uiAccess: "",
        });
        setSelectedPermissions(new Set());
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create role");
      console.error("Error creating role:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", formData);
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as { [key: string]: Permission[] });

  return (
    <div className="min-h-full pb-16">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Role Created Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                The role has been created and is ready to be assigned to users.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setShowSuccess(false);
                    router.push("/admin/roles");
                  }}
                  className="px-6"
                >
                  View Roles
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowSuccess(false)}
                  className="px-6"
                >
                  Create Another
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      <div className="bg-white rounded-xl p-8">
        {/* Title */}
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-4xl text-gray-900 font-bold">Basic Info</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-6xl space-y-6">
          {/* Role Name & Department */}
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Role Name *"
              variant="orange"
              value={formData.roleName}
              onChange={(e) =>
                setFormData({ ...formData, roleName: e.target.value })
              }
              placeholder="Enter role name"
              required
            />

            <Select
              label="Department (Optional)"
              variant="orange"
              selectClassName="px-6 py-4 border-2 bg-white text-base"
              options={loading ? [] : departments.filter(dept => dept.id && dept.name).map((dept) => ({
                value: dept.id,
                label: dept.name,
              }))}
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
              placeholder={loading ? "Loading departments..." : departments.length === 0 ? "No departments available" : "Select Department"}
            />
          </div>

          {/* Scope Level & UI Access */}
          <div className="grid grid-cols-2 gap-6">
            <Select
              label="Scope Level *"
              variant="orange"
              selectClassName="px-6 py-4 border-2 bg-white text-base bg-gray-100 cursor-not-allowed"
              options={scopeLevelOptions}
              value={formData.scopeLevel}
              onChange={(val) => setFormData({ ...formData, scopeLevel: val })}
              placeholder="Select Scope Level"
              disabled
            />

            <Select
              label="UI Access *"
              variant="orange"
              selectClassName="px-6 py-4 border-2 bg-white text-base"
              options={uiAccessOptions}
              value={formData.uiAccess}
              onChange={(val) => setFormData({ ...formData, uiAccess: val })}
              placeholder="Select UI Access"
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

          {/* Permissions Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Permissions *
            </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading permissions...
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(groupedPermissions).map((module) => (
                  <div
                    key={module}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 capitalize">
                        {module}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const modulePermissions = groupedPermissions[module];
                          const allSelected = modulePermissions.every((p) =>
                            selectedPermissions.has(p.name)
                          );

                          modulePermissions.forEach((p) => {
                            if (allSelected) {
                              selectedPermissions.delete(p.name);
                            } else {
                              selectedPermissions.add(p.name);
                            }
                          });
                          setSelectedPermissions(new Set(selectedPermissions));
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {groupedPermissions[module].every((p) =>
                          selectedPermissions.has(p.name)
                        )
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedPermissions[module].map((permission) => (
                        <div
                          key={permission._id}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                        >
                          <input
                            type="checkbox"
                            id={permission._id}
                            checked={selectedPermissions.has(permission.name)}
                            onChange={() =>
                              handlePermissionToggle(permission.name)
                            }
                            className="mt-1 accent-blue-600 w-5 h-5 rounded transition border-gray-300 shadow-sm cursor-pointer"
                          />
                          <label
                            htmlFor={permission._id}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-gray-900">
                              {permission.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {permission.description}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Permissions Count */}
          <div className="text-center text-sm text-gray-600 py-2">
            {selectedPermissions.size} permission(s) selected
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="px-12 rounded-lg"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Publish"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="px-12 rounded-lg"
              onClick={handleSaveDraft}
              disabled={submitting}
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
