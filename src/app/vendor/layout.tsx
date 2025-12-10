"use client";

import { VendorSidebar } from "@/components";
import { VendorHeader } from "@/components/layout/Vendor";
import RoleBasedProtectedRoute from "@/components/auth/RoleBasedProtectedRoute";
import { Toaster } from "react-hot-toast";

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleBasedProtectedRoute
      requiredUIAccess="Admin Panel"
      allowedRoles={["vendor_admin", "vendor"]}
    >
      <div className="flex">
        <VendorSidebar />
        <main className="ml-64 flex-1 bg-gray-50 min-h-screen">
          <VendorHeader />
          <div className="pt-10 p-8">
            <Toaster
              position="top-right"
              containerStyle={{ top: 80 }}
              toastOptions={{
                duration: 3000,
              }}
            />
            {children}
          </div>
        </main>
      </div>
    </RoleBasedProtectedRoute>
  );
}
