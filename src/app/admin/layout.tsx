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
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
