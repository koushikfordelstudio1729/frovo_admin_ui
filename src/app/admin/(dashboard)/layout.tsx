import { AdminHeader } from "@/components";
import { AdminSidebar } from "@/components";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 bg-gray-50 min-h-full">
        <AdminHeader />
        <div className="pt-10 p-8">{children}</div>
      </main>
    </div>
  );
}
