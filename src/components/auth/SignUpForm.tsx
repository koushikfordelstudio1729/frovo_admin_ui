"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@/components/common";

interface SignUpFormProps {
  redirectPath: string;
  loginLink: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ redirectPath, loginLink }) => {
  const router = useRouter();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  }>({});

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({});

    // Validation
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
    } = {};

    if (!firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to login or dashboard
      router.push(redirectPath);
    } catch (err) {
      console.error("Sign up error:", err);
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Logo */}
      <div className="absolute top-0 left-34 p-6 mt-4">
        <Image
          src="/images/logo.svg"
          alt="Frovo Logo"
          width={150}
          height={50}
          priority
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-linear-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign Up</h2>

          {/* General Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                variant="orange"
                type="text"
                label="First Name"
                placeholder=""
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={errors.firstName}
                disabled={isLoading}
                fullWidth
                required
              />

              <Input
                variant="orange"
                type="text"
                label="Last Name"
                placeholder=""
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={errors.lastName}
                disabled={isLoading}
                fullWidth
                required
              />
            </div>

            {/* Email Field */}
            <Input
              variant="orange"
              type="email"
              label="Email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
              fullWidth
              required
            />

            {/* Phone Number Field */}
            <Input
              variant="orange"
              type="tel"
              label="Phone Number"
              placeholder=""
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={errors.phoneNumber}
              disabled={isLoading}
              fullWidth
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-[#FF5722] hover:bg-[#F4511E] text-white mt-6"
            >
              Sign up
            </Button>

            {/* Footer - Already have account */}
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href={loginLink}
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Vending Machine Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-white">
        <div className="relative w-full h-full max-w-lg max-h-[600px] flex items-center justify-center">
          <Image
            src="/images/login_page_vm.png"
            alt="Frovo Vending Machine"
            width={500}
            height={700}
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
