"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input, Button } from "@/components/common";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value: string) => /^[0-9]{10}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailOrPhone) {
      setError("Email or Phone is required.");
      return;
    }

    if (!isValidEmail(emailOrPhone) && !isValidPhone(emailOrPhone)) {
      setError("Enter a valid Email or 10-digit Phone number.");
      return;
    }

    setIsLoading(true);

    try {
      // Faster redirect (only 300ms)
      await new Promise((res) => setTimeout(res, 300));

      // Redirect to OTP page
      router.push("/admin/verify-otp");
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
          src="/images/logo.svg"
          alt="Frovo Logo"
          width={150}
          height={50}
          priority
        />
      </div>

      <div className="w-full max-w-md mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Forgot Password ?
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            variant="orange"
            type="text"
            label="Enter Email or Phone"
            labelClassName="text-base font-medium"
            placeholder="Enter your email address or phone number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            disabled={isLoading}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            className="rounded-lg"
          >
            Send OTP
          </Button>

          <p className="text-sm text-gray-600 text-center">
            Remember your password?{" "}
            <Link
              href="/admin/login"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
