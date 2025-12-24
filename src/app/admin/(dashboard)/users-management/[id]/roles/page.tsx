"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, BackHeader, Badge } from "@/components/common";
import SuccessDialog from "@/components/common/SuccessDialog";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  roles?: Array<{
    id: string;
    name: string;
    key: string;
  }>;
}

interface Role {
  id: string;
  name: string;
  key: string;
  description?: string;
}

export default function ManageRolesPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: User;
      }>(apiConfig.endpoints.users.getById(userId));

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setSelectedRoleIds(new Set(userData.roles?.map((r) => r.id) || []));
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user details");
    }
  }, [userId]);

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
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUser(), fetchRoles()]);
      setLoading(false);
    };

    if (userId) {
      fetchData();
    }
  }, [userId, fetchUser, fetchRoles]);

  // Auto-dismiss success dialog after 2 seconds and redirect
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        router.push("/admin/users-management");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, router]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const response = await api.post(
        apiConfig.endpoints.users.assignRoles(userId),
        {
          roleIds: Array.from(selectedRoleIds),
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to assign roles");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="Manage User Roles" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="Manage User Roles" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-red-600 mb-4">User not found</p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.push("/admin/users-management")}
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-10">
      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccess}
        title="Roles Updated Successfully!"
        message={`Roles have been updated for ${user.name}.`}
        onClose={() => setShowSuccess(false)}
      />

      {/* Header */}
      <div className="mb-6">
        <BackHeader title="Manage User Roles" />
      </div>

      {/* Themed Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        {/* Gradient header */}
        <div className="bg-linear-to-r from-orange-500 via-red-500 to-rose-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            Assign Roles & Permissions
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            Control what this user can access in the system
          </p>
        </div>

        {/* Body */}
        <div className="p-8 bg-linear-to-b from-white to-orange-50/40">
          {/* User Info */}
          <div className="mb-8 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Currently assigned roles:{" "}
                  {user.roles && user.roles.length > 0
                    ? user.roles.map((r) => r.name).join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Roles Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-900">
                  Available Roles
                </label>
                <span className="text-sm text-gray-700 bg-orange-50 px-4 py-2 rounded-full font-medium border border-orange-100">
                  {selectedRoleIds.size} of {roles.length} selected
                </span>
              </div>

              <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {roles.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No roles available
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {roles.map((role) => {
                      const isSelected = selectedRoleIds.has(role.id);

                      return (
                        <div
                          key={role.id}
                          className={`p-4 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-orange-50 hover:bg-orange-100"
                              : "bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => handleToggleRole(role.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id={`role-${role.id}`}
                              checked={isSelected}
                              onChange={() => handleToggleRole(role.id)}
                              className="mt-1 accent-orange-600 w-5 h-5 rounded cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={`role-${role.id}`}
                                className="font-semibold text-gray-900 cursor-pointer block"
                              >
                                {role.name}
                              </label>
                              <p className="text-sm text-gray-600 font-mono mt-1">
                                {role.key}
                              </p>
                              {role.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {role.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <Badge
                                label="Selected"
                                size="sm"
                                variant="active"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t border-gray-100 mt-6">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => router.push("/admin/users-management")}
                disabled={submitting}
                className="px-8 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting}
                className="px-8 rounded-lg"
              >
                {submitting ? "Saving..." : "Save Roles"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
