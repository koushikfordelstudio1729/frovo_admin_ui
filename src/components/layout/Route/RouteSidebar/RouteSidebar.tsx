"use client";

import React from "react";
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  BarChart2,
  User,
  Shield,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  routeManagementNavigation,
  RouteManagementMenuItem,
} from "@/config/route/route.config";
import { ModuleSwitcher } from "../../../common/ModuleSwitcher";

const iconMap = {
  layoutDashboard: LayoutDashboard,
  userPlus: UserPlus,
  fileText: FileText,
  barChart2: BarChart2,
  user: User,
  shield: Shield,
} as const;

const RouteManagementSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const group1 = routeManagementNavigation.slice(0, 3);
  // const group2 = routeManagementNavigation.slice(2, 4);
  // const group3 = routeManagementNavigation.slice(4);

  const TopLevelSidebar = (item: RouteManagementMenuItem) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
    const isActive = item.href ? pathname === item.href : false;

    const handleItemClick = () => {
      if (item.href) router.push(item.href);
    };

    return (
      <button
        key={item.label}
        type="button"
        onClick={handleItemClick}
        className={`w-full flex items-center justify-between text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-200
          ${isActive ? "bg-orange-500 text-white" : "text-gray-700 "}
        `}
      >
        <span className="flex items-center gap-2">
          <Icon
            size={20}
            className={isActive ? "text-white" : "text-orange-400"}
          />
          <span className="ml-1 text-sm">{item.label}</span>
        </span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white min-h-screen fixed left-0 top-0 overflow-y-auto p-6">
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/logo.svg"
          alt="frovo logo"
          width={130}
          height={50}
          priority
        />
      </div>

      {/* Module Switcher */}
      <ModuleSwitcher currentModule="route" />

      <nav className="space-y-5">
        {group1.length > 0 && (
          <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
            {group1.map(TopLevelSidebar)}
          </div>
        )}
        {/* {group2.length > 0 && (
          <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
            {group2.map(TopLevelSidebar)}
          </div>
        )}
        {group3.length > 0 && (
          <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
            {group3.map(TopLevelSidebar)}
          </div>
        )} */}
      </nav>
    </aside>
  );
};

export default RouteManagementSidebar;
