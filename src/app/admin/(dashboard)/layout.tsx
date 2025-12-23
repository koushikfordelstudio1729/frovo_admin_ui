"use client";

import { AdminHeader } from "@/components";
import { AdminSidebar } from "@/components";
import { AdminProtectedRoute } from "@/components/auth/RoleBasedProtectedRoute";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="ml-64 flex-1 bg-gray-50 w-0">
          <AdminHeader />
          <div className="pt-10 p-8 w-full">{children}</div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
