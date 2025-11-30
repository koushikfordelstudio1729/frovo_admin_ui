"use client";

import React, { useState } from "react";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import {
  Button,
  Input,
  Label,
  PasswordValidation,
  PasswordToggleButton,
} from "@/components/common";

export default function UserChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    password: newPassword,
    setPassword: setNewPassword,
    confirmPassword,
    setConfirmPassword,
    allValid,
    validationRules,
  } = usePasswordValidation();

  // Check if all fields are filled
  const allFieldsFilled =
    oldPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "";


  const isFormValid = allFieldsFilled && allValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Password changed successfully!");
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex justify-center">
        <Label className="text-3xl font-bold mb-8 text-center">
          Change Password
        </Label>
      </div>

      <div className="space-y-4">
        {/* Old Password */}
        <Input
          label="Old Password"
          variant="orange"
          type={showPassword.old ? "text" : "password"}
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          rightIcon={
            <PasswordToggleButton
              isVisible={showPassword.old}
              onToggle={() => togglePasswordVisibility("old")}
            />
          }
        />

        {/* New Password */}
        <Input
          label="New Password"
          variant="orange"
          type={showPassword.new ? "text" : "password"}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          rightIcon={
            <PasswordToggleButton
              isVisible={showPassword.new}
              onToggle={() => togglePasswordVisibility("new")}
            />
          }
        />

        {/* Confirm New Password */}
        <Input
          label="Confirm New Password"
          variant="orange"
          type={showPassword.confirm ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          rightIcon={
            <PasswordToggleButton
              isVisible={showPassword.confirm}
              onToggle={() => togglePasswordVisibility("confirm")}
            />
          }
        />
      </div>

      <PasswordValidation validationRules={validationRules} className="mt-8" />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-6 rounded-lg"
        disabled={!isFormValid}
      >
        Change Password
      </Button>
    </form>
  );
}
