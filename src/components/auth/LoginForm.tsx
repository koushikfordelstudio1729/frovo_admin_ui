"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, Checkbox, Input } from "@/components/common";
import PasswordToggleButton from "@/components/common/PasswordToggleButton";
import { authAPI } from "@/services/authAPI";
import { storageUtils } from "@/utils";
import type { User as AuthUser } from "@/types/auth.types";
import { getRedirectPathByUser } from "@/config/roleRouting.config";

export interface User {
  email: string;
  password: string;
  role: string;
  name: string;
  redirectPath: string;
}

export interface LoginFormProps {
  users: User[];
  forgotPasswordPath?: string;
  logoUrl?: string;
  illustrationUrl?: string;
  appName?: string;
}

// Note: Role routing logic has been moved to @/config/roleRouting.config.ts
// This makes it easier to add new roles and maintain routing configuration

export const LoginForm: React.FC<LoginFormProps> = ({
  users,
  forgotPasswordPath = "/forgot-password",
  logoUrl = "/images/logo.svg",
  illustrationUrl = "/images/login_page_vm.png",
  appName = "Frovo",
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = storageUtils.getToken();
      const user = storageUtils.getUser<AuthUser>();

      if (token && user) {
        // User is already logged in, redirect to their role-specific dashboard
        const path = getRedirectPathByUser(user);
        router.push(path);
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Load remembered email on component mount
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("email");

    if (remembered === "true" && savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  }, []);

  const isFormValid = email.trim() !== "" && password !== ""; 

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Store tokens and user data
        storageUtils.setToken(accessToken);
        storageUtils.setRefreshToken(refreshToken);
        storageUtils.setUser(user);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("email", email);
        }

        // Redirect based on user's role using centralized routing config
        const path = getRedirectPathByUser(user);
        router.push(path);
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Invalid credentials. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Logo */}
      <div className="absolute top-0 left-34 p-6 mt-4">
        <Image
          src={logoUrl}
          alt={`${appName} Logo`}
          width={150}
          height={50}
          priority
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Login</h2>

          {/* Test Credentials Banner */}
          {users.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Test Credentials:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                {users.map((user) => (
                  <li key={user.role}>
                    • {user.name}: {user.email} / {user.password}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              variant="orange"
              type="email"
              label="Email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
              fullWidth
              required
            />

            {/* Password Field */}
            <Input
              variant="orange"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                label="Remember me"
              />

              <Link
                href={forgotPasswordPath}
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!isFormValid || isLoading}
              className="rounded-lg"
            >
              Login
            </Button>
          </form>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={illustrationUrl}
            alt={`${appName} Illustration`}
            width={500}
            height={700}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
