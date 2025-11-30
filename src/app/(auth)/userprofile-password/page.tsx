"use client";

import React from "react";
import Image from "next/image";
import UserChangePassword from "@/components/auth/UserChangePassword";

export default function UserProfilePasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start">
      {/* header logo */}
      <div className="p-6">
        <Image
          src="/images/logo.svg"
          alt="Frovo"
          width={150}
          height={60}
          priority
        />
      </div>

      {/* Password change */}
      <div className="w-full flex justify-center">
        <UserChangePassword />
      </div>
    </div>
  );
}
