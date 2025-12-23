"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Building2,
  Clock,
  IdCard,
  User as UserIcon,
} from "lucide-react";
import { Button, Badge, BackHeader } from "@/components/common";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  departments?: Array<{
    id: string;
    name: string;
  }>;
  roles?: Array<{
    id: string;
    name: string;
    key: string;
  }>;
  status: string;
  lastLogin?: string;
  createdAt: string;
}

export default function ViewUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; data: User }>(
          apiConfig.endpoints.users.getById(userId)
        );

        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="User Details" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Loading user details...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="User Details" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-red-600 mb-4">{error || "User not found"}</p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.push("/admin/users-management")}
            className="rounded-lg"
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <BackHeader title="User Details" />
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        {/* Banner with theme gradient */}
        <div className="bg-linear-to-r from-orange-500 via-red-500 to-rose-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          <p className="text-orange-100 text-sm mt-1">
            Complete user information and assigned permissions
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 bg-linear-to-b from-white to-orange-50/40">
          {/* Avatar + basic info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <Badge
                    label={user.status === "active" ? "Active" : "Inactive"}
                    size="md"
                    variant={user.status === "active" ? "active" : "inactive"}
                    showDot
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact + Account info in 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-orange-600" />
                </span>
                Contact Information
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-gray-900 mt-1 font-medium break-all">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-gray-900 mt-1 font-medium">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <IdCard className="w-4 h-4 text-purple-600" />
                </span>
                Account Information
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    User ID
                  </p>
                  <p className="text-gray-900 mt-1 font-mono text-xs break-all">
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Created At
                  </p>
                  <p className="text-gray-900 mt-1 font-medium">
                    {new Date(user.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {user.lastLogin && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Last Login
                    </p>
                    <p className="text-gray-900 mt-1 font-medium">
                      {new Date(user.lastLogin).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-green-600" />
              </span>
              Departments
            </h4>
            {user.departments && user.departments.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="px-4 py-2 rounded-full bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 text-sm font-medium text-green-800"
                  >
                    {dept.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No departments assigned
              </p>
            )}
          </div>

          {/* Roles */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </span>
              Roles & Permissions
            </h4>
            {user.roles && user.roles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.roles.map((role) => (
                  <div
                    key={role.id}
                    className="bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-orange-900">
                          {role.name}
                        </p>
                        <p className="text-xs text-orange-600 font-mono mt-1">
                          {role.key}
                        </p>
                      </div>
                      <Badge label="Active" size="sm" variant="active" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No roles assigned</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between md:justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.push("/admin/users-management")}
            className="rounded-lg"
          >
            Back to Users
          </Button>
          <Button
            variant="primary"
            size="md"
            className="rounded-lg"
            onClick={() =>
              router.push(`/admin/users-management/${userId}/edit`)
            }
          >
            Edit User
          </Button>
        </div>
      </div>
    </div>
  );
}
