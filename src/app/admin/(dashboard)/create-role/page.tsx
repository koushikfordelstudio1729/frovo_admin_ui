"use client";

import {
  ArrowLeft,
  Search,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  BackHeader,
} from "@/components/common";
import SuccessDialog from "@/components/common/SuccessDialog"; // Import SuccessDialog
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
    scopeLevel: "global",
    description: "",
    uiAccess: "",
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successConfig, setSuccessConfig] = useState({
    title: "",
    message: "",
  });

  const scopeLevelOptions = [{ value: "global", label: "Global" }];

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
        data:
          | Permission[]
          | {
              permissions: {
                [group: string]: Array<{
                  id: string;
                  key: string;
                  description: string;
                  module: string;
                  action: string;
                }>;
              };
            };
      }>(apiConfig.endpoints.permissions.list);

      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          setPermissions(response.data.data);
        } else if (response.data.data && "permissions" in response.data.data) {
          const allPermissions: Permission[] = [];
          Object.values(response.data.data.permissions).forEach(
            (groupPerms) => {
              groupPerms.forEach((perm) => {
                allPermissions.push({
                  _id: perm.id,
                  name: perm.key,
                  description: perm.description,
                  module: perm.module,
                  action: perm.action,
                });
              });
            }
          );
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

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPermissions(), fetchDepartments()]);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchPermissions, fetchDepartments]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Auto-dismiss success dialog after 2 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

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

  const toggleModule = (module: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(module)) {
        newSet.delete(module);
      } else {
        newSet.add(module);
      }
      return newSet;
    });
  };

  const toggleAllModulePermissions = (module: string) => {
    const modulePermissions = groupedPermissions[module];
    const allSelected = modulePermissions.every((p) =>
      selectedPermissions.has(p.name)
    );

    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      modulePermissions.forEach((p) => {
        if (allSelected) {
          newSet.delete(p.name);
        } else {
          newSet.add(p.name);
        }
      });
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
        // Show success dialog
        setSuccessConfig({
          title: "Role Created Successfully!",
          message: `The role "${formData.roleName}" has been created and is ready to be assigned to users.`,
        });
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
        setSearchQuery("");

        // Navigate after dialog closes (2 seconds + small delay)
        setTimeout(() => {
          router.push("/admin/roles-permissions");
        }, 2500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create role");
      console.error("Error creating role:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // Show success dialog for draft
    setSuccessConfig({
      title: "Draft Saved Successfully!",
      message: `Your role draft has been saved. You can continue editing it later.`,
    });
    setShowSuccess(true);

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

  // Filter permissions based on search
  const filteredGroupedPermissions = Object.keys(groupedPermissions).reduce(
    (acc, module) => {
      const filteredPerms = groupedPermissions[module].filter(
        (perm) =>
          perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredPerms.length > 0) {
        acc[module] = filteredPerms;
      }
      return acc;
    },
    {} as { [key: string]: Permission[] }
  );

  // Calculate module statistics
  const getModuleStats = (module: string) => {
    const total = groupedPermissions[module].length;
    const selected = groupedPermissions[module].filter((p) =>
      selectedPermissions.has(p.name)
    ).length;
    return { total, selected };
  };

  // Select all permissions
  const selectAllPermissions = () => {
    const allPermissionNames = permissions.map((p) => p.name);
    setSelectedPermissions(new Set(allPermissionNames));
  };

  // Deselect all permissions
  const deselectAllPermissions = () => {
    setSelectedPermissions(new Set());
  };

  return (
    <div className="min-h-full pb-16">
      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccess}
        title={successConfig.title}
        message={successConfig.message}
        onClose={() => setShowSuccess(false)}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mt-4">
        <BackHeader title="Create new role" />
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl p-8">
        {/* Title */}
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-3xl text-gray-900 font-bold">Basic Info</h2>
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
              options={
                loading
                  ? []
                  : departments
                      .filter((dept) => dept.id && dept.name)
                      .map((dept) => ({
                        value: dept.id,
                        label: dept.name,
                      }))
              }
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
              placeholder={
                loading
                  ? "Loading departments..."
                  : departments.length === 0
                  ? "No departments available"
                  : "Select Department"
              }
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Permissions *
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 bg-orange-50 px-4 py-2 rounded-full font-medium">
                  {selectedPermissions.size} of {permissions.length} selected
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={selectAllPermissions}
                  className="text-sm"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={deselectAllPermissions}
                  className="text-sm"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Search Permissions */}
            <div className="mb-6">
              <Input
                variant="search"
                placeholder="Search permissions by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search size={20} />}
              />
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading permissions...
              </div>
            ) : (
              <div className="space-y-3">
                {Object.keys(filteredGroupedPermissions).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No permissions found matching your search.
                  </div>
                ) : (
                  Object.keys(filteredGroupedPermissions).map((module) => {
                    const stats = getModuleStats(module);
                    const isExpanded = expandedModules.has(module);
                    const allSelected = stats.selected === stats.total;

                    return (
                      <div
                        key={module}
                        className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
                      >
                        {/* Module Header */}
                        <div
                          className="bg-gray-50 px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => toggleModule(module)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAllModulePermissions(module);
                                }}
                                className="hover:scale-110 transition-transform"
                              >
                                {allSelected ? (
                                  <CheckSquare className="w-6 h-6 text-orange-600" />
                                ) : stats.selected > 0 ? (
                                  <div className="w-6 h-6 border-2 border-orange-600 rounded bg-orange-100 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-orange-600 rounded-sm" />
                                  </div>
                                ) : (
                                  <Square className="w-6 h-6 text-gray-400" />
                                )}
                              </button>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 capitalize">
                                  {module}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {stats.selected} of {stats.total} permissions
                                  selected
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                                {stats.total} permissions
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Module Permissions */}
                        {isExpanded && (
                          <div className="p-6 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {filteredGroupedPermissions[module].map(
                                (permission) => (
                                  <div
                                    key={permission._id}
                                    className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                      selectedPermissions.has(permission.name)
                                        ? "bg-orange-50 border-orange-300 hover:bg-orange-100"
                                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                    }`}
                                    onClick={() =>
                                      handlePermissionToggle(permission.name)
                                    }
                                  >
                                    <input
                                      type="checkbox"
                                      id={permission._id}
                                      checked={selectedPermissions.has(
                                        permission.name
                                      )}
                                      onChange={() =>
                                        handlePermissionToggle(permission.name)
                                      }
                                      className="mt-1 accent-orange-600 w-5 h-5 rounded transition border-gray-300 shadow-sm cursor-pointer"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <label
                                      htmlFor={permission._id}
                                      className="flex-1 cursor-pointer"
                                    >
                                      <div className="font-semibold text-gray-900 mb-1">
                                        {permission.name}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {permission.description}
                                      </div>
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center pt-6">
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
