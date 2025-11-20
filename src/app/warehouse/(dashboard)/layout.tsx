"use client";

import { WarehouseHeader } from "@/components/layout/Warehouse/WarehouseHeader/WarehouseHeader";
import { WarehouseSidebar } from "@/components/layout/Warehouse/WarehouseSidebar/WarehouseSidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <WarehouseSidebar />
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen">
        <WarehouseHeader />
        <div className="pt-10 p-8">{children}</div>
      </main>
    </div>
  );
}
