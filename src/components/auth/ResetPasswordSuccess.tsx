"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";

export interface ResetPasswordSuccessProps {
  logoUrl?: string;
  appName?: string;
  loginPath?: string;
  title?: string;
  description?: string;
  buttonText?: string;
}

export const ResetPasswordSuccess: React.FC<ResetPasswordSuccessProps> = ({
  logoUrl = "/images/logo.svg",
  appName = "Frovo",
  loginPath = "/login",
  title = "Password Changed!",
  description = "Let's Go! Your password has been changed successfully.",
  buttonText = "Login",
}) => {
  const router = useRouter();

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

      <div className="w-full max-w-md mx-auto px-6 text-center">
        <div className="flex justify-center mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
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

        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>

        <p className="text-base text-gray-600 mb-8">{description}</p>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push(loginPath)}
          className="rounded-lg"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
