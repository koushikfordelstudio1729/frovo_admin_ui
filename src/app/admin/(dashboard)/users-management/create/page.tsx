"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  User,
  Shield,
  Building2,
} from "lucide-react";
import { Button, Input, BackHeader } from "@/components/common";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";
import SuccessDialog from "@/components/common/SuccessDialog";

interface Role {
  id: string;
  name: string;
  key: string;
}

interface Department {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  departments: string[];
  roles: string[];
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export default function CreateUserPage() {
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    departments: [],
    roles: [],
  });

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  // Validation functions (used only on submit)
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return undefined; // Phone is optional
    const numericPhone = phone.replace(/\D/g, "");
    if (numericPhone.length < 10)
      return "Phone number must be at least 10 digits";
    if (numericPhone.length > 15) return "Phone number is too long";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
    };

    setFieldErrors(errors);

    return !Object.values(errors).some((error) => error !== undefined);
  };

  // Password strength calculator (purely visual)
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

  const passwordStrength = getPasswordStrength(form.password);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: Role[] }>(
        apiConfig.endpoints.roles
      );
      if (res.data.success) setRoles(res.data.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: Department[] }>(
        apiConfig.endpoints.departments
      );
      if (res.data.success) setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchRoles(), fetchDepartments()]);
      setInitialLoading(false);
    };
    loadData();
  }, [fetchRoles, fetchDepartments]);

  // Auto-dismiss success dialog
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
    setError(null);

    if (!validateForm()) {
      setError("Please fix the errors below before submitting");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(apiConfig.endpoints.users.create, form);

      if (res.data.success) {
        setShowSuccess(true);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));

      // Only clear that field's error while typing, but only for scalar fields
      type ErrorField = keyof FieldErrors; // "name" | "email" | "phone" | "password"

      if (["name", "email", "phone", "password"].includes(field)) {
        const errorField = field as ErrorField;
        if (fieldErrors[errorField]) {
          setFieldErrors((prev) => ({ ...prev, [errorField]: undefined }));
        }
      }

      if (error) {
        setError(null);
      }
    };

  const handleCheckboxChange = (
    key: "departments" | "roles",
    id: string,
    checked: boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: checked
        ? [...prev[key], id]
        : prev[key].filter((value) => value !== id),
    }));
  };

  const isFormValid =
    form.name.trim() && form.email.trim() && form.password.trim();

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-4">
        <div className="mb-4">
          <BackHeader title="Add New User" />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccess}
        title="User Created Successfully!"
        message={`${form.name} has been added to the system.`}
        onClose={() => setShowSuccess(false)}
      />

      {/* Header */}
      <div className="mb-6">
        <BackHeader title="Add New User" />
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            Create New User Account
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            Fill in the details below to add a new user to the system
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Full Name *"
                    variant="orange"
                    value={form.name}
                    onChange={handleInputChange("name")}
                    placeholder="Enter full name"
                    error={fieldErrors.name}
                    startIcon={<User size={20} className="text-gray-400" />}
                  />
                </div>

                <Input
                  label="Email Address *"
                  variant="orange"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange("email")}
                  placeholder="user@example.com"
                  error={fieldErrors.email}
                  startIcon={<Mail size={20} className="text-gray-400" />}
                />

                <Input
                  label="Phone Number"
                  variant="orange"
                  value={form.phone}
                  onChange={handleInputChange("phone")}
                  placeholder="+1 (555) 000-0000"
                  error={fieldErrors.phone}
                  startIcon={<Phone size={20} className="text-gray-400" />}
                />
              </div>
            </div>

            {/* Security Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Security
                </h3>
              </div>

              <div className="relative">
                <Input
                  label="Password *"
                  variant="orange"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleInputChange("password")}
                  placeholder="Enter a strong password"
                  error={fieldErrors.password}
                  startIcon={<Lock size={20} className="text-gray-400" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-14 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator (visual only) */}
              {form.password && (
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
                        form.password.length >= 8 ? "text-green-600" : ""
                      }
                    >
                      {form.password.length >= 8 ? "✓" : "○"} At least 8
                      characters
                    </p>
                    <p
                      className={
                        /[A-Z]/.test(form.password) ? "text-green-600" : ""
                      }
                    >
                      {/[A-Z]/.test(form.password) ? "✓" : "○"} One uppercase
                      letter
                    </p>
                    <p
                      className={
                        /[a-z]/.test(form.password) ? "text-green-600" : ""
                      }
                    >
                      {/[a-z]/.test(form.password) ? "✓" : "○"} One lowercase
                      letter
                    </p>
                    <p
                      className={
                        /[0-9]/.test(form.password) ? "text-green-600" : ""
                      }
                    >
                      {/[0-9]/.test(form.password) ? "✓" : "○"} One number
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Departments Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Departments
                </h3>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                {departments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No departments available
                  </p>
                ) : (
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <label
                        key={dept.id}
                        className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={form.departments.includes(dept.id)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              "departments",
                              dept.id,
                              e.target.checked
                            )
                          }
                          className="accent-orange-600 w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                          {dept.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {form.departments.length} department(s) selected
              </p>
            </div>

            {/* Roles Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Roles & Permissions
                </h3>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                {roles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No roles available
                  </p>
                ) : (
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-start gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={form.roles.includes(role.id)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              "roles",
                              role.id,
                              e.target.checked
                            )
                          }
                          className="accent-orange-600 w-4 h-4 rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium block">
                            {role.name}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {role.key}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {form.roles.length} role(s) selected
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-8 border-t mt-8">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => router.push("/admin/users-management")}
              disabled={loading}
              className="px-8 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isFormValid || loading}
              className="px-8 rounded-lg"
            >
              {loading ? "Creating User..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
