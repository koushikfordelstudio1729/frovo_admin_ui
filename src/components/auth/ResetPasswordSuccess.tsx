"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";

export default function ResetPasswordSuccess() {
  const router = useRouter();

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

      {/* Center Content */}
      <div className="w-full max-w-md mx-auto px-6 text-center">
        {/* Icon: outline circle with gap + tick (slightly outside) */}
        <div className="flex justify-center mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outline circle with gap */}
            <circle
              cx="60"
              cy="60"
              r="38"
              stroke="#FF6A3D"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="240"
              strokeDashoffset="50"
            />

            {/* Tick mark extended outside */}
            <path
              d="M40 62 L52 76 L92 38"
              stroke="#FF6A3D"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Password Changed!
        </h2>

        <p className="text-base text-gray-600 mb-8">
          Let’s Go! Your password has been changed successfully.
        </p>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push("/admin/login")}
          className="rounded-lg"
        >
          Login
        </Button>
      </div>
    </div>
  );
}
