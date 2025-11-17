"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components";
import { authAPI } from "@/services/authAPI";
import type { User } from "@/types";

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await authAPI.getCurrentUser();

        if (response.data.success) {
          setUser(response.data.data.user);
          setPermissions(response.data.data.permissions);
        } else {
          setError("Failed to fetch user profile");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        setPasswordSuccess(response.data.message);
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError("Failed to change password");
      }
    } catch (err: unknown) {
      console.error("Password change error:", err);
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setPasswordError(
          error.response?.data?.message || "Failed to change password"
        );
      } else {
        setPasswordError("An error occurred while changing password");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-full bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">{error || "User not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-8">
      {/* Title */}
      <div className="mb-8 flex items-center gap-3">
        <button className="text-gray-700 hover:text-gray-900 p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
      </div>

      {/* Main Container */}
      <div className="mx-auto bg-white rounded-xl p-8 ">
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center gap-8 mb-8">
          {/* Avatar */}
          <div className="w-48 h-48 rounded-full border-8 border-orange-500 shrink-0 bg-orange-100 flex items-center justify-center">
            <span className="text-6xl font-bold text-orange-600">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Name and Email*/}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-xl text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Role List Section */}
        <div className="mb-8 flex flex-col justify-center items-center">
          <h3 className="text-2xl font-medium text-gray-900 mb-4">Role List</h3>

          {/* Table */}
          <div className="w-sm rounded-lg">
            {/* Header */}
            <div className="grid grid-cols-2 bg-orange-600 text-white font-bold">
              <div className="px-6 py-4 text-black font-medium text-xl">
                Role
              </div>
              <div className="px-6 py-4 text-black font-medium text-xl">
                Scope
              </div>
            </div>

            {/* Body */}
            {user.roles.map((role, index) => (
              <div
                key={role.id}
                className={`grid grid-cols-2 ${
                  index !== user.roles.length - 1
                    ? "border border-gray-200"
                    : ""
                }`}
              >
                <div className="px-6 py-4 text-gray-900 font-medium text-xl border border-gray-400 rounded-bl-xl">
                  {role.name}
                </div>
                <div className="px-6 py-4 text-gray-700 font-medium text-xl  border border-gray-400 rounded-br-xl">
                  {role.scope.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Summary */}
        <div className="mb-8 flex flex-col justify-end items-center">
          <h3 className="text-2xl font-medium text-gray-900 mb-4">
            Permission Summary
          </h3>

          <div className="flex gap-4 flex-wrap justify-center">
            {permissions.map((perm, index) => (
              <div
                key={index}
                className="px-4 py-2 text-xl bg-white border border-gray-300 rounded-lg text-gray-700 font-medium"
              >
                {perm}
              </div>
            ))}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-medium text-gray-900">
                  Change Password
                </h3>
                {!showPasswordForm && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setShowPasswordForm(true)}
                    className="rounded-lg"
                  >
                    Change Password
                  </Button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Success Message */}
                  {passwordSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      {passwordSuccess}
                    </div>
                  )}

                  {/* Error Message */}
                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {passwordError}
                    </div>
                  )}

                  {/* Current Password */}
                  <Input
                    variant="orange"
                    type={showCurrentPassword ? "text" : "password"}
                    label="Current Password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    error={passwordErrors.currentPassword}
                    disabled={isChangingPassword}
                    fullWidth
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    }
                  />

                  {/* New Password */}
                  <Input
                    variant="orange"
                    type={showNewPassword ? "text" : "password"}
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={passwordErrors.newPassword}
                    disabled={isChangingPassword}
                    fullWidth
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    }
                  />

                  {/* Confirm Password */}
                  <Input
                    variant="orange"
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm New Password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={passwordErrors.confirmPassword}
                    disabled={isChangingPassword}
                    fullWidth
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    }
                  />

                  {/* Buttons */}
                  <div className="flex gap-4 justify-end pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setPasswordErrors({});
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                      disabled={isChangingPassword}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isChangingPassword}
                      disabled={isChangingPassword}
                      className="rounded-lg"
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Request More Access Button */}
        <div className="flex justify-center">
          <Button variant="primary" size="lg" className="px-10 rounded-lg">
            Request More Access
          </Button>
        </div>
      </div>
    </div>
  );
}
