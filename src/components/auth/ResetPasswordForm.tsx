"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input, Button } from "@/components/common";
import { useRouter } from "next/navigation";

interface ResetPasswordFormProps {
  redirectPath?: string;
}

export default function ResetPasswordForm({
  redirectPath = "/admin/success",
}: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_\-+={}[\]|;:"'<>,.?/~`]/.test(
    password
  );

  const allValid = hasMinLength && hasUpper && hasNumberOrSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!allValid) {
      setError("Password does not meet the requirements.");
      return;
    }

    if (password !== confirm) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 300));

      setSuccess("Password changed successfully.");

      //  Correct redirect (dynamic)
      setTimeout(() => {
        router.push(redirectPath);
      }, 350);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Image
          src="/images/logo.svg"
          alt="Frovo Logo"
          width={150}
          height={50}
          priority
        />
      </div>

      <div className="w-full max-w-md mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Reset Password
        </h2>

        <p className="text-sm text-gray-600 mb-8 text-center">
          Create a new password for your account
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            variant="orange"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            fullWidth
            required
          />

          <Input
            variant="orange"
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isLoading}
            fullWidth
            required
          />

          {/* Help Text */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <span className="text-orange-500 text-sm">Help</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4 text-orange-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2 text-sm mt-4">
            <div className="text-orange-500">
              {hasMinLength ? (
                <span className="text-green-600">✔</span>
              ) : (
                <span className="text-gray-400">○</span>
              )}{" "}
              Password must be at least 8 characters long
            </div>

            <div className="text-orange-500">
              {hasUpper ? (
                <span className="text-green-600">✔</span>
              ) : (
                <span className="text-gray-400">○</span>
              )}{" "}
              Password must contain at least one uppercase letter
            </div>

            <div className="text-orange-500 whitespace-nowrap">
              {hasNumberOrSpecial ? (
                <span className="text-green-600">✔</span>
              ) : (
                <span className="text-gray-400">○</span>
              )}{" "}
              Password must contain at least one number or special character
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            className="rounded-lg"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
