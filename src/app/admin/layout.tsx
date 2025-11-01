import { AdminHeader } from "@/components/layout/AdminHeader/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="ml-64 flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <AdminHeader />
        <div className="pt-10 p-8">{children}</div>
      </main>
    </div>
  );
}
