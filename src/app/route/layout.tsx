"use client";

import { RouteHeader, RouteSidebar } from "@/components/layout/Route";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <RouteSidebar />
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen">
        <RouteHeader />
        <div className="pt-10 p-8">{children}</div>
      </main>
    </div>
  );
}
