"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, BackHeader } from "@/components/common";
import SuccessDialog from "@/components/common/SuccessDialog";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  departments?: Array<{
    id: string;
    name: string;
  }>;
}

interface Department {
  id: string;
  name: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    departments: [] as string[],
  });

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
        setFormData({
          name: userData.name,
          phone: userData.phone || "",
          departments: userData.departments?.map((d) => d.id) || [],
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user details");
    }
  }, [userId]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: Department[];
      }>(apiConfig.endpoints.departments);

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUser(), fetchDepartments()]);
      setLoading(false);
    };

    if (userId) {
      fetchData();
    }
  }, [userId, fetchUser, fetchDepartments]);

  // Auto-dismiss success dialog after 2 seconds, then go back to list
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        router.push("/admin/users-management");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await api.put(
        apiConfig.endpoints.users.update(userId),
        formData
      );

      if (response.data.success) {
        setShowSuccess(true);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="Edit User" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Loading user details...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="Edit User" />
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
      {/* Success Dialog (auto closes in 2 seconds) */}
      <SuccessDialog
        open={showSuccess}
        title="User Updated Successfully!"
        message={`The user "${formData.name}" has been updated.`}
        onClose={() => setShowSuccess(false)}
      />

      {/* Header */}
      <div className="mb-6">
        <BackHeader title="Edit User" />
      </div>

      {/* Themed Form Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        {/* Gradient header */}
        <div className="bg-linear-to-r from-orange-500 via-red-500 to-rose-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            Update User Information
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            Modify basic details and department assignments
          </p>
        </div>

        {/* Body */}
        <div className="p-8 bg-linear-to-b from-white to-orange-50/40">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <Input
              label="Name *"
              variant="orange"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter user name"
              required
            />

            {/* Email (Read-only) */}
            <Input
              label="Email (cannot be changed)"
              variant="orange"
              value={user.email}
              disabled
              className="bg-gray-100"
            />

            {/* Phone */}
            <Input
              label="Phone"
              variant="orange"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />

            {/* Departments Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departments
              </label>
              <div className="border-2 border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                {departments.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No departments available
                  </p>
                ) : (
                  departments.map((dept) => (
                    <label
                      key={dept.id}
                      htmlFor={`dept-${dept.id}`}
                      className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-white rounded-md px-2 py-1 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`dept-${dept.id}`}
                        checked={formData.departments.includes(dept.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              departments: [...prev.departments, dept.id],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              departments: prev.departments.filter(
                                (d) => d !== dept.id
                              ),
                            }));
                          }
                        }}
                        className="accent-orange-600 w-4 h-4 rounded"
                      />
                      <span className="text-sm text-gray-700">{dept.name}</span>
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formData.departments.length} department(s) selected
              </p>
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
                {submitting ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
