"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";

export default function VerifyOtpForm() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;

    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);

    if (val && idx < inputRefs.current.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 250));

      setSuccess("OTP Verified Successfully.");

      setTimeout(() => {
        router.push("/admin/reset-password");
      }, 200);
    } catch {
      setError("Invalid OTP. Please try again.");
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

      {/* Form container */}
      <div className="w-full max-w-md mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Forgot Password ?
        </h2>

        {/* Success message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subtext */}
          <p className="text-sm text-gray-600 text-left">Enter OTP</p>

          {/* OTP inputs */}
          <div className="flex gap-3 justify-center mt-2 mb-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="
                  w-12 h-12 
                  border border-gray-300 
                  rounded-lg 
                  text-center 
                  text-lg 
                  font-semibold 
                  text-gray-900
                  bg-white
                  focus:border-orange-500 
                  focus:ring-2 
                  focus:ring-orange-400 
                  outline-none
                "
              />
            ))}
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
            Verify OTP
          </Button>

          <p className="text-sm text-gray-600 mt-2 text-center">
            Didn’t receive OTP?{" "}
            <button
              type="button"
              onClick={() => {
                setSuccess("OTP resent.");
                setTimeout(() => setSuccess(""), 1500);
              }}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Resend
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
