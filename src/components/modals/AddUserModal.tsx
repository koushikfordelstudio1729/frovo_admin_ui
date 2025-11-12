"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Input, Toggle } from "../common";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
}: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    role?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleToggleChange = (enabled: boolean) => {
    setFormData({
      ...formData,
      isActive: enabled,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        role: "",
        isActive: true,
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed w-full inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add user</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tell us about your project so we can set things up for you.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <Input
            variant="default"
            type="text"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            error={errors.name}
            disabled={isLoading}
            fullWidth
            required
          />

          {/* Email */}
          <Input
            variant="default"
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            error={errors.email}
            disabled={isLoading}
            fullWidth
            required
          />

          {/* Phone */}
          <Input
            variant="default"
            type="tel"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            error={errors.phone}
            disabled={isLoading}
            fullWidth
            required
          />

          {/* Department */}
          <Input
            variant="default"
            type="text"
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Select Department"
            error={errors.department}
            disabled={isLoading}
            fullWidth
            required
          />

          {/* Role */}
          <Input
            variant="default"
            type="text"
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Add role"
            error={errors.role}
            disabled={isLoading}
            fullWidth
            required
          />

          <Toggle
            enabled={formData.isActive}
            onChange={handleToggleChange}
            label={"Active"}
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              className="px-12 bg-[#FF5722] hover:bg-[#F4511E]"
            >
              Send Invites
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
