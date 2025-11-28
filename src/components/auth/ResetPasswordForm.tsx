"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input, Button, PasswordToggleButton } from "@/components/common";
import { useRouter } from "next/navigation";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import PasswordValidation from "@/components/common/PasswordValidation";

export interface ResetPasswordFormProps {
  logoUrl?: string;
  appName?: string;
  successPath?: string;
  onPasswordReset?: (newPassword: string) => Promise<void>;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  logoUrl = "/images/logo.svg",
  appName = "Frovo",
  successPath = "/success",
  onPasswordReset,
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // password validation
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    allValid,
    validationRules,
  } = usePasswordValidation();

  const isFormValid = allValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!allValid) {
      setError("Password does not meet the requirements.");
      return;
    }

    setIsLoading(true);
    try {
      if (onPasswordReset) {
        await onPasswordReset(password);
      } else {
        await new Promise((res) => setTimeout(res, 300));
      }

      setSuccess("Password changed successfully.");
      setTimeout(() => {
        router.push(successPath);
      }, 350);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="absolute top-6 left-6">
        <Image
          src={logoUrl}
          alt={`${appName} Logo`}
          width={150}
          height={50}
          priority
        />
      </div>

      <div className="w-full max-w-md mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Reset Password
        </h2>

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
          {/* New Password */}
          <Input
            variant="orange"
            type={showPassword ? "text" : "password"}
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            fullWidth
            required
            rightIcon={
              <PasswordToggleButton
                isVisible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />

          {/* Confirm Password  */}
          <Input
            variant="orange"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            fullWidth
            required
            rightIcon={
              <PasswordToggleButton
                isVisible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />

          {/* Password Validation */}
          <PasswordValidation
            validationRules={validationRules}
            className="mt-4"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            className="rounded-lg transition-all duration-200"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
