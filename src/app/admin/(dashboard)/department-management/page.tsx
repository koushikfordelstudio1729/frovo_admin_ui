"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button, Input, Textarea } from "@/components/common";
import { api } from "@/services/api";
import { apiConfig } from "@/config";

interface Role {
  id: string;
  name: string;
  key: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface DepartmentPayload {
  name: string;
  description: string;
  code?: string;
  roles: string[];
  members: string[];
}

export const CreateDepartmentForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: Role[];
      }>(apiConfig.endpoints.roles);

      if (response.data.success) {
        setRoles(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setRoles([]);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: User[];
      }>(apiConfig.endpoints.users.list);

      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchRoles(), fetchUsers()]);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchRoles, fetchUsers]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Department name is required");
      return;
    }

    const payload: DepartmentPayload = {
      name: formData.name,
      description: formData.description,
      roles: Array.from(selectedRoles),
      members: Array.from(selectedUsers),
      ...(formData.code && { code: formData.code }),
    };

    try {
      setSubmitting(true);
      setError(null);
      const response = await api.post(apiConfig.endpoints.departments, payload);

      if (response.data.success) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          name: "",
          description: "",
          code: "",
        });
        setSelectedRoles(new Set());
        setSelectedUsers(new Set());
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create department");
      console.error("Error creating department:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
                Department Created Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                The department has been created and is ready to use.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setShowSuccess(false);
                    router.push("/admin/departments");
                  }}
                  className="px-6"
                >
                  View Departments
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
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-6xl space-y-6">
          {/* Department Name & Code */}
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Department Name *"
              variant="orange"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter department name"
              required
            />

            <Input
              label="Department Code (Optional)"
              variant="orange"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Enter department code"
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
            placeholder="Enter description"
          />

          {/* Roles Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Available Roles
            </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading roles...
              </div>
            ) : roles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No roles available
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={selectedRoles.has(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="mt-1 accent-blue-600 w-5 h-5 rounded transition border-gray-300 shadow-sm cursor-pointer"
                      />
                      <label
                        htmlFor={`role-${role.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">
                          {role.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {role.key}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-600 mt-4">
                  {selectedRoles.size} role(s) selected
                </div>
              </div>
            )}
          </div>

          {/* Users Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Add Users
            </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users available
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                    >
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={selectedUsers.has(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        className="mt-1 accent-blue-600 w-5 h-5 rounded transition border-gray-300 shadow-sm cursor-pointer"
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-600 mt-4">
                  {selectedUsers.size} user(s) selected
                </div>
              </div>
            )}
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
              {submitting ? "Creating..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="px-12 rounded-lg"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateDepartmentForm;
