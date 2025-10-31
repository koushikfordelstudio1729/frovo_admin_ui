"use client";

import React from "react";
import Link from "next/link";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  isActive,
}) => {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center gap-3 px-4 py-2 rounded-lg mb-2 transition-all duration-200
          ${isActive ? "bg-orange-500 text-white" : " text-gray-700"}
        `}
      >
        <Icon
          size={20}
          className={isActive ? "text-white" : "text-orange-500"}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default SidebarItem;
