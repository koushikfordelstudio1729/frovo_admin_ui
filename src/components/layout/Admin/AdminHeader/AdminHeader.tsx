"use client";

import { adminNavigation } from "@/config/admin/admin.config";
import { Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export const AdminHeader: React.FC = () => {
  const pathname = usePathname();

  // Find the current page title from adminNavigation
  const currentPage = adminNavigation.find((item) => item.href === pathname);
  const title = currentPage?.label || "Admin Dashboard";

  return (
    <header className="fixed top-0 right-0 left-64 bg-white h-16 flex items-center justify-between px-8 z-40">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {/* Right Section */}
      <div className="flex items-center gap-6 text-black">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
        >
          <Bell size={24} />
        </button>
        {/* Profile Icon */}
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
