"use client";

import { WarehouseHeader } from "@/components/layout/Warehouse/WarehouseHeader/WarehouseHeader";
import { WarehouseSidebar } from "@/components/layout/Warehouse/WarehouseSidebar/WarehouseSidebar";
import { WarehouseProtectedRoute } from "@/components/auth/RoleBasedProtectedRoute";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WarehouseProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <WarehouseSidebar />

        <main className="pl-64 min-h-screen">
          <WarehouseHeader />

          <div className="pt-12 px-8 pb-8 max-w-full">{children}</div>
        </main>
      </div>
    </WarehouseProtectedRoute>
  );
}
