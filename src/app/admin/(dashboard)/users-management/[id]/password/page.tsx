"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input, BackHeader } from "@/components/common";
import SuccessDialog from "@/components/common/SuccessDialog";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UpdatePasswordPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
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
        setUser(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

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

  // Password strength helper (same logic as create user)
  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (strength <= 4)
      return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 5)
      return { strength: 3, label: "Good", color: "bg-blue-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pwd = formData.newPassword;

    // Strong validation (same rules as create user)
    if (!pwd) {
      setError("Password is required");
      return;
    }
    if (pwd.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(pwd)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(pwd)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(pwd)) {
      setError("Password must contain at least one number");
      return;
    }
    // optional special char rule:
    // if (!/[^A-Za-z0-9]/.test(pwd)) {
    //   setError("Password must contain at least one special character");
    //   return;
    // }

    if (pwd !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await api.patch(
        apiConfig.endpoints.users.updatePassword(userId),
        {
          newPassword: pwd,
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="Update Password" />
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
          <BackHeader title="Update Password" />
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
        title="Password Updated Successfully!"
        message={`Password has been updated for ${user.name}.`}
        onClose={() => setShowSuccess(false)}
      />

      {/* Header */}
      <div className="mb-6">
        <BackHeader title="Update Password" />
      </div>

      {/* Themed Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        {/* Gradient header */}
        <div className="bg-linear-to-r from-orange-500 via-red-500 to-rose-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Set New Password</h2>
          <p className="text-orange-100 text-sm mt-1">
            Update the login credentials for this user
          </p>
        </div>

        {/* Body */}
        <div className="p-8 bg-linear-to-b from-white to-orange-50/40">
          {/* User Info */}
          <div className="mb-8 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              🔐 Password must be at least 8 characters long and include
              uppercase, lowercase letters and a number.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password *"
                variant="orange"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-14 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password *"
                variant="orange"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-14 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator + checklist */}
            {formData.newPassword && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    Password Strength:
                  </p>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength.strength === 1
                        ? "text-red-600"
                        : passwordStrength.strength === 2
                        ? "text-yellow-600"
                        : passwordStrength.strength === 3
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        level <= passwordStrength.strength
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-600 space-y-1 mt-2">
                  <p
                    className={
                      formData.newPassword.length >= 8 ? "text-green-600" : ""
                    }
                  >
                    {formData.newPassword.length >= 8 ? "✓" : "○"} At least 8
                    characters
                  </p>
                  <p
                    className={
                      /[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""
                    }
                  >
                    {/[A-Z]/.test(formData.newPassword) ? "✓" : "○"} One
                    uppercase letter
                  </p>
                  <p
                    className={
                      /[a-z]/.test(formData.newPassword) ? "text-green-600" : ""
                    }
                  >
                    {/[a-z]/.test(formData.newPassword) ? "✓" : "○"} One
                    lowercase letter
                  </p>
                  <p
                    className={
                      /[0-9]/.test(formData.newPassword) ? "text-green-600" : ""
                    }
                  >
                    {/[0-9]/.test(formData.newPassword) ? "✓" : "○"} One number
                  </p>
                </div>
              </div>
            )}

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
                {submitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
